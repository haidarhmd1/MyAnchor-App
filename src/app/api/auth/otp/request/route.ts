import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { hashSync } from "bcryptjs";
import prisma from "../../../../../../lib/prisma";

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

  let bucket = await prisma.rateLimitBucket.findUnique({
    where: { key: bucketKey },
  });
  if (!bucket) {
    bucket = await prisma.rateLimitBucket.create({
      data: { key: bucketKey, tokens: capacity },
    });
  }

  const minutes = Math.max(
    0,
    (now.getTime() - bucket.updatedAt.getTime()) / 60000,
  );
  const refill = Math.floor(minutes * refillRatePerMinute);
  let tokens = Math.min(capacity, bucket.tokens + refill);

  if (tokens <= 0) {
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

async function sendWithMailerSend(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const fromName = process.env.EMAIL_FROM_NAME || "Your App";

  if (!apiKey) throw new Error("Missing MAILERSEND_API_KEY");
  if (!fromEmail) throw new Error("Missing EMAIL_FROM");

  const res = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      from: { email: fromEmail, name: fromName },
      to: [{ email: params.to }],
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  const messageId = res.headers.get("x-message-id");

  if (res.status !== 202) {
    // MailerSend returns JSON errors; grab it for logging
    let errBody: unknown = null;
    try {
      errBody = await res.json();
    } catch {
      // ignore
    }
    const msg =
      typeof errBody === "object" && errBody && "message" in errBody
        ? String((errBody as any).message)
        : `mailersend_http_${res.status}`;

    throw Object.assign(new Error(msg), { messageId });
  }

  return { messageId };
}

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // x-forwarded-for can be "client, proxy1, proxy2"
  const rawXff = req.headers.get("x-forwarded-for");
  const ip = rawXff ? rawXff.split(",")[0]!.trim() : undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  // Rate limits (tweak as desired)
  const okIp = await takeToken(`otp:ip:${ip ?? "unknown"}`, 10, 5);
  const okEmail = await takeToken(`otp:email:${normalized}`, 5, 2);
  if (!okIp || !okEmail) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  const code = generateCode(6);
  const tokenHash = hashSync(code, 10);
  const expiresAt = DateTime.utc().plus({ minutes: 30 }).toJSDate();

  await prisma.emailOTP.create({
    data: { email: normalized, tokenHash, expiresAt, ip, userAgent },
  });

  try {
    const { messageId } = await sendWithMailerSend({
      to: normalized,
      subject: "Your sign-in code",
      text: `Your code is: ${code}. It expires in 30 minutes.`,
      html: `<p>Your code is: <strong style="font-size:20px">${code}</strong></p>
             <p>It expires in 30 minutes.</p>`,
    });

    await prisma.emailLog.create({
      data: {
        toEmail: normalized,
        template: "otp",
        providerId: messageId ?? null,
        success: true,
      },
    });
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "message" in err
        ? String((err as any).message)
        : "mailersend_error";

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
