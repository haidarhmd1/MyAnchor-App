import { NextResponse } from "next/server";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { apiErrorResponse } from "@/lib/api-errors";
import { HEALTH_DATA_POLICY } from "@/lib/consent";
import { prisma } from "../../../../../lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { userId } = await getUserOrThrow();
    const withdrawnAt = new Date();

    const result = await prisma.consent.updateMany({
      where: {
        userId,
        policy: HEALTH_DATA_POLICY,
        withdrawnAt: null,
      },
      data: { withdrawnAt },
    });

    return NextResponse.json({ withdrawn: result.count > 0, withdrawnAt });
  } catch (error) {
    return apiErrorResponse(
      error,
      "health_data_consent_withdraw_failed",
      request,
    );
  }
}
