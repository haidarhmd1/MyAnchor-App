import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const journals = await prisma.journal.findMany();

  return new Response(JSON.stringify(journals), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    hasAnxietyAttack,
    hasAvoidedSituations,
    typesOfSituationYouAvoided,
    typesOfSituationYouWereIn,
    whyYourWhereAvoidingIt,
    typesOfBodySymptoms,
    anxietyLevelRating,
  } = body;

  const newJournalEntry = await prisma.journal.create({
    data: {
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
}
