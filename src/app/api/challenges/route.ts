import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { ChallengeSchema } from "@/lib/zod.types";
import { withAuth } from "@/lib/auth/auth-helpers";

export async function GET() {
  const challenges = await prisma.challenge.findMany();

  return new Response(JSON.stringify(challenges), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuth(async (request, _ctx, { userId }) => {
  const body = await request.json();
  const parsed = ChallengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
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
