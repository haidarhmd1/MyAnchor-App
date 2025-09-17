import { JournalFormSchema } from "@/lib/zod.types";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/auth-helpers";

export async function GET(_request: Request) {
  const journals = await prisma.journal.findMany();

  return new Response(JSON.stringify(journals), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = withAuth(async (request, _ctx, { userId }) => {
  const body = await request.json();
  const parsed = JournalFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    hasAnxietyAttack,
    hasAvoidedSituations,
    typesOfSituationYouAvoided,
    typesOfSituationYouWereIn,
    whyYourWhereAvoidingIt,
    typesOfBodySymptoms,
    anxietyLevelRating,
  } = parsed.data;

  const newJournalEntry = await prisma.journal.create({
    data: {
      userId,
      hasAnxietyAttack,
      hasAvoidedSituations,
      typesOfSituationYouAvoided,
      typesOfSituationYouWereIn,
      whyYourWereAvoidingIt: whyYourWhereAvoidingIt,
      typesOfBodySymptoms,
      anxietyLevelRating,
    },
  });

  return new Response(JSON.stringify(newJournalEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});
