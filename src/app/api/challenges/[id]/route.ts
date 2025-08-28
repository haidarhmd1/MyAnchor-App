import { NextRequest } from "next/server";
import prisma from "../../../../../lib/prisma";
import { FormChallengeOutcomeType } from "@/app/(main)/exposure/challenge/[id]/_components/helper";
import { ChallengeStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    if (!id) {
      return Response.json({ error: "Missing challenge id" }, { status: 400 });
    }
    const body = (await request.json()) as FormChallengeOutcomeType;
    const challenge = await prisma.challenge.findFirst({
      where: { id, deletedAt: null, status: ChallengeStatus.NOT_STARTED },
      select: { id: true },
    });

    if (!challenge) {
      return Response.json({ error: "Challenge not found" }, { status: 404 });
    }

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        status: ChallengeStatus.FINISHED,
        outcome: {
          create: {
            didComplete: body.hadCompletedChallenge ?? null,
            hadAnxietyAttack: body.hadAnxietyAttack ?? null,
            reasonsNotDone: body.reasonsNotDone ?? [],
            stoppedEarly: body.stoppedEarly ?? null,
            stopReasons: body.stopReasons ?? [],
            actionsTaken: body.actionsTaken ?? [],
            bodySymptoms: body.typesOfBodySymptoms ?? [],
            anxietyLevel: body.anxietyLevelRating ?? null,
            challengeRating: body.challengeRating ?? null,
            copingStrategies: body.copingStrategies ?? [],
          },
        },
      },
    });

    return Response.json("Challenge outcome saved", { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/challenges/[id] error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
