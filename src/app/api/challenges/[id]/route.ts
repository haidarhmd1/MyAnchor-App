import { NextResponse } from "next/server";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import { z } from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { ChallengeStatus } from "@/generated/prisma/enums";
import { prisma } from "../../../../../lib/prisma";
import { apiErrorResponse } from "@/lib/api-errors";
import { idempotentJson } from "@/lib/idempotency";

type Ctx = { params: Promise<{ id: string }> };

export const POST = async (request: Request, ctx: Ctx) => {
  try {
    const { userId } = await getUserOrThrow();
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing challenge id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = ChallengeOutcomeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const { hadCompletedChallenge, safetyBehavior } = parsed.data;

    const challenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
        status: ChallengeStatus.STARTED,
      },
      select: { id: true },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    return idempotentJson({
      request,
      userId,
      route: `/api/challenges/${id}/outcome`,
      execute: async (tx) => {
        await tx.challenge.update({
          where: { id: challenge.id },
          data: {
            status: ChallengeStatus.FINISHED,
            outcome: {
              create: {
                didComplete: hadCompletedChallenge ?? false,
                safetyBehavior: safetyBehavior ?? "",
              },
            },
          },
        });

        return {
          body: { message: "Challenge outcome saved" },
          status: 201,
        };
      },
    });
  } catch (err: unknown) {
    return apiErrorResponse(err, "challenge_outcome_create_failed", request);
  }
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { userId } = await getUserOrThrow();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing entry id" }, { status: 400 });
    }

    const existingEntry = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const deletedAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.challenge.update({
        where: {
          id,
        },
        data: {
          deletedAt,
        },
      });

      await tx.challengeOutcome.updateMany({
        where: {
          challengeId: id,
          deletedAt: null,
        },
        data: {
          deletedAt,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error, "challenge_delete_failed", _);
  }
}
