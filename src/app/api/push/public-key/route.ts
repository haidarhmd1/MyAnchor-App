import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse } from "@/lib/api-errors";

export async function GET(request: Request) {
  try {
    await getUserOrThrow();
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) throw new Error("VAPID_PUBLIC_KEY is not configured");

    return NextResponse.json({ publicKey });
  } catch (error) {
    return apiErrorResponse(error, "push_public_key_read_failed", request);
  }
}
