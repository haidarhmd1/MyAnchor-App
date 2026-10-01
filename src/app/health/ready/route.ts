import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("readiness_timeout")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function GET() {
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 1_500);
    return NextResponse.json(
      { status: "ready" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    logError("readiness_check_failed", error);
    return NextResponse.json(
      { status: "not_ready" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
