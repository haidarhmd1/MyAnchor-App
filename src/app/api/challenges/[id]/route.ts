import { NextResponse } from "next/server";
import { ChallengeStatus } from "@prisma/client";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import prisma from "../../../../../lib/prisma";
import { z } from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";

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

    await prisma.challenge.update({
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
};
