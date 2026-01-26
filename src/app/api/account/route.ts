import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "@/lib/auth/auth";

export async function DELETE(req: Request) {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  // Return ok even if user doesn't exist
  if (!user) return NextResponse.json({ ok: true });

  await prisma.$transaction(async (tx) => {
    // Invalidate OTPs
    await tx.emailOTP.updateMany({
      where: { email, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    // Audit record (optional)
    await tx.signInAudit
      .create({
        data: {
          userId: user.id,
          email,
          method: "account-delete(hard)",
          outcome: "success",
          ip,
          userAgent,
        },
      })
      .catch(() => {});

    // Hard delete the user (cascades to SignInAudit, Consent, momentLog, Challenge, etc.)
    await tx.user.delete({ where: { id: user.id } });
  });

  return NextResponse.json({ ok: true });
}
