import { NextResponse } from "next/server";
import { ChallengeStatus } from "@prisma/client";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import prisma from "../../../../../lib/prisma";
import { withAuth } from "@/lib/auth/auth-helpers";

type Ctx = { params: { id: string } };

export const POST = withAuth(async (request: Request, ctx: Ctx, { userId }) => {
  try {
    const { id } = ctx.params;
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
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const {
      hadCompletedChallenge,
      hadAnxietyAttack,
      reasonsNotDone,
      stoppedEarly,
      stopReasons,
      actionsTaken,
      typesOfBodySymptoms,
      anxietyLevelRating,
      challengeRating,
      copingStrategies,
    } = parsed.data;

    const challenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
        status: ChallengeStatus.NOT_STARTED,
      },
      select: { id: true },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 },
      );
    }

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        status: ChallengeStatus.FINISHED,
        outcome: {
          create: {
            didComplete: hadCompletedChallenge ?? null,
            hadAnxietyAttack: hadAnxietyAttack,
            reasonsNotDone: reasonsNotDone ?? [],
            stoppedEarly: stoppedEarly ?? null,
            stopReasons: stopReasons ?? [],
            actionsTaken: actionsTaken ?? [],
            bodySymptoms: typesOfBodySymptoms ?? [],
            anxietyLevel: anxietyLevelRating ?? null,
            challengeRating: challengeRating ?? null,
            copingStrategies: copingStrategies ?? [],
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Challenge outcome saved" },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("POST /api/challenges/[id] error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
