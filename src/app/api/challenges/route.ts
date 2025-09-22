import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { ChallengeSchema } from "@/lib/zod.types";
import { withAuth } from "@/lib/auth/auth-helpers";
import z from "zod";

export const GET = withAuth(async (_request, _ctx, { userId }) => {
  const challenge = await prisma.challenge.findMany({
    where: {
      userId,
      deletedAt: null,
    },
  });

  return NextResponse.json({ challenge }, { status: 200 });
});

export const POST = withAuth(async (request, _ctx, { userId }) => {
  const body = await request.json();
  const parsed = ChallengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }
  const { company, challengeOption, status } = parsed.data;
  const newChallengeEntry = await prisma.challenge.create({
    data: {
      userId,
      company,
      challengeOption,
      status,
    },
  });

  return new Response(JSON.stringify(newChallengeEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});
