import { NextRequest, NextResponse } from "next/server";
import { ChallengeSchema } from "@/lib/zod.types";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { apiErrorResponse } from "@/lib/api-errors";
import { idempotentJson } from "@/lib/idempotency";

export const GET = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const challenge = await prisma.challenge.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return NextResponse.json({ challenge }, { status: 200 });
  } catch (error) {
    return apiErrorResponse(error, "challenge_read_failed", request);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await getUserOrThrow();
    const body = await request.json();
    const parsed = ChallengeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const { socialContext, challengeOptionId, status } = parsed.data;
    return idempotentJson({
      request,
      userId,
      route: "/api/challenges",
      execute: async (tx) => ({
        body: await tx.challenge.create({
          data: {
            userId,
            socialContext,
            challengeOptionId,
            status,
          },
          select: { id: true },
        }),
        status: 201,
      }),
    });
  } catch (error) {
    return apiErrorResponse(error, "challenge_create_failed", request);
  }
};
