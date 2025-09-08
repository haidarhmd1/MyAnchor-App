import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import sgMail from "@sendgrid/mail";
import { hashSync } from "bcryptjs";
import prisma from "../../../../../../lib/prisma";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

function generateCode(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// Simple token bucket in DB: refillRate tokens per minute, capacity cap
async function takeToken(
  bucketKey: string,
  capacity: number,
  refillRatePerMinute: number,
) {
  const now = new Date();
  // Create if missing
  let bucket = await prisma.rateLimitBucket.findUnique({
    where: { key: bucketKey },
  });
  if (!bucket) {
    bucket = await prisma.rateLimitBucket.create({
      data: { key: bucketKey, tokens: capacity },
    });
  }
  // Refill based on elapsed minutes since updatedAt
  const last = bucket.updatedAt;
  const minutes = Math.max(0, (now.getTime() - last.getTime()) / 60000);
  const refill = Math.floor(minutes * refillRatePerMinute);
  let tokens = Math.min(capacity, bucket.tokens + refill);

  if (tokens <= 0) {
    // no tokens available
    await prisma.rateLimitBucket.update({
      where: { key: bucketKey },
      data: { tokens, updatedAt: now },
    });
    return false;
  }

  tokens -= 1;
  await prisma.rateLimitBucket.update({
    where: { key: bucketKey },
    data: { tokens, updatedAt: now },
  });
  return true;
}

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Rate limits (tweak as desired)
  const okIp = await takeToken(`otp:ip:${ip ?? "unknown"}`, 10, 5); // capacity 10, refill 5/min
  const okEmail = await takeToken(`otp:email:${normalized}`, 5, 2); // capacity 5, refill 2/min
  if (!okIp || !okEmail) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  const code = generateCode(6);
  const tokenHash = hashSync(code, 10);
  const expiresAt = DateTime.utc().plus({ minutes: 30 }).toJSDate(); // 30-minute expiry

  await prisma.emailOTP.create({
    data: { email: normalized, tokenHash, expiresAt, ip, userAgent },
  });

  try {
    const [res] = await sgMail.send({
      to: normalized,
      from: process.env.EMAIL_FROM!, // haidar.hmd1@gmail.com
      subject: "Your sign-in code",
      text: `Your code is: ${code}. It expires in 30 minutes.`,
      html: `<p>Your code is: <strong style="font-size:20px">${code}</strong></p>
             <p>It expires in 30 minutes.</p>`,
    });
    await prisma.emailLog.create({
      data: {
        toEmail: normalized,
        template: "otp",
        providerId: res?.headers?.["x-message-id"]?.toString() ?? null,
        success: true,
      },
    });
  } catch (err: unknown) {
    // Type-safe error extraction
    let msg = "sendgrid_error";
    if (err && typeof err === "object") {
      const e = err as { message?: unknown };
      if (typeof e.message === "string") msg = e.message;
    }

    await prisma.emailLog.create({
      data: {
        toEmail: normalized,
        template: "otp",
        success: false,
        error: msg,
      },
    });

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
