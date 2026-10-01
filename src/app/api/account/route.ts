import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse } from "@/lib/api-errors";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId, user } = await getUserOrThrow();
    const email = user.email?.trim().toLowerCase();

    await prisma.$transaction(async (tx) => {
      if (email) {
        await tx.emailOTP.deleteMany({ where: { email } });
        await tx.emailLog.deleteMany({ where: { toEmail: email } });
        await tx.signInAudit.deleteMany({ where: { email } });
      }

      await tx.user.delete({ where: { id: userId } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, "account_delete_failed", req);
  }
}
