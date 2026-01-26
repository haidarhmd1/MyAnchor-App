import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ChallengeSchema } from "@/lib/zod.types";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import z from "zod";

export const GET = async () => {
  const { userId } = await getUserOrThrow();
  const challenge = await prisma.challenge.findMany({
    where: {
      userId,
      deletedAt: null,
    },
  });

  return NextResponse.json({ challenge }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
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
  const newChallengeEntry = await prisma.challenge.create({
    data: {
      userId,
      socialContext,
      challengeOptionId,
      status,
    },
  });

  return new Response(JSON.stringify(newChallengeEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
