import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { hash } from "bcryptjs";
import { prisma } from "../../../../../../lib/prisma";
import { generateOtpCode, OTP_TTL_MINUTES } from "@/lib/auth/otp";
import { getClientAddress, takeFixedWindowLimit } from "@/lib/rate-limit";
import { apiErrorResponse, getRequestId } from "@/lib/api-errors";

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
    signal: AbortSignal.timeout(10_000),
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
        ? String(errBody.message)
        : `mailersend_http_${res.status}`;

    throw Object.assign(new Error(msg), { messageId });
  }

  return { messageId };
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const normalized = (email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 },
      );
    }

    const ip = getClientAddress(req);
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const [okIp, okEmail] = await Promise.all([
      ip
        ? takeFixedWindowLimit({
            key: `otp:ip:${ip}`,
            limit: 20,
            windowSeconds: 15 * 60,
          })
        : Promise.resolve(true),
      takeFixedWindowLimit({
        key: `otp:email:${normalized}`,
        limit: 5,
        windowSeconds: 15 * 60,
      }),
    ]);

    if (!okIp || !okEmail) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "retry-after": "900" } },
      );
    }

    const code = generateOtpCode();
    const tokenHash = await hash(code, 10);
    const expiresAt = DateTime.utc()
      .plus({ minutes: OTP_TTL_MINUTES })
      .toJSDate();

    await prisma.emailOTP.create({
      data: {
        email: normalized,
        tokenHash,
        expiresAt,
        ip: ip ?? undefined,
        userAgent,
      },
    });

    let messageId: string | null = null;
    try {
      const delivery = await sendWithMailerSend({
        to: normalized,
        subject: "Your sign-in code",
        text: `Your code is: ${code}. It expires in ${OTP_TTL_MINUTES} minutes.`,
        html: `<p>Your code is: <strong style="font-size:20px">${code}</strong></p>
               <p>It expires in ${OTP_TTL_MINUTES} minutes.</p>`,
      });
      messageId = delivery.messageId;
    } catch (error) {
      await prisma.emailLog
        .create({
          data: {
            toEmail: normalized,
            template: "otp",
            success: false,
            error: error instanceof Error ? error.name : "UnknownError",
          },
        })
        .catch(() => undefined);
      throw error;
    }

    await prisma.emailLog.create({
      data: {
        toEmail: normalized,
        template: "otp",
        providerId: messageId,
        success: true,
      },
    });
    return NextResponse.json(
      { ok: true },
      { headers: { "x-request-id": getRequestId(req) } },
    );
  } catch (err: unknown) {
    return apiErrorResponse(err, "otp_request_failed", req);
  }
}
