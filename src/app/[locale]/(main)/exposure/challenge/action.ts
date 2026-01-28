// app/[locale]/(main)/exposure/challenge/actions.ts
"use server";

import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { ChallengeStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "../../../../../../lib/prisma";

export async function startChallengeAction(
  challengeId: string,
  pathToRevalidate: string,
) {
  const { userId } = await getUserOrThrow();

  const challenge = await prisma.challenge.findFirst({
    where: {
      id: challengeId,
      userId,
      deletedAt: null,
      status: ChallengeStatus.NOT_STARTED,
    },
    select: { id: true },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  await prisma.challenge.update({
    where: { id: challenge.id },
    data: { status: ChallengeStatus.STARTED },
  });

  revalidatePath(pathToRevalidate);
}
