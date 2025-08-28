import prisma from "../../../../lib/prisma";

export async function GET() {
  const challenges = await prisma.challenge.findMany();

  return new Response(JSON.stringify(challenges), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { company, challengeOption, status } = body;

  const newChallengeEntry = await prisma.challenge.create({
    data: {
      company,
      challengeOption,
      status,
    },
  });

  return new Response(JSON.stringify(newChallengeEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
