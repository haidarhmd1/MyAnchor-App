import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

export const GET = async (request: NextRequest) => {
  const { userId } = await getUserOrThrow();
  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get("startDate");

  let start: DateTime;
  if (startParam) {
    start = DateTime.fromISO(startParam).startOf("month");
  } else {
    start = DateTime.now().startOf("month");
  }
  const end = start.endOf("month");

  const anxietyAttackJournal = await prisma.journal.findMany({
    where: {
      userId,
      deletedAt: null,
      hasAnxietyAttack: true,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    select: {
      id: true,
      createdAt: true,
      typesOfSituationYouWereIn: true,
      typesOfBodySymptoms: true,
    },
  });

  if (anxietyAttackJournal.length === 0)
    return NextResponse.json(
      {
        anxietyAttackJournal: {
          taxonomiesTypesOfBodySymptoms: [],
          taxonomiesTypesOfSituationYouWereIn: [],
        },
      },
      { status: 200 },
    );

  const taxonomy = await prisma.taxonomy.findMany({
    select: {
      id: true,
      type: true,
      label: true,
    },
  });

  const journalWithLabels = anxietyAttackJournal.map((a) => ({
    id: a.id,
    date: a.createdAt.toISOString(),
    typesOfBodySymptoms: a.typesOfBodySymptoms.map((symptomId: string) =>
      taxonomy.find((t) => t.id === symptomId),
    ),
    typesOfSituationYouWereIn: taxonomy.find(
      (t) => t.id === a.typesOfSituationYouWereIn,
    ),
  }));

  return NextResponse.json(journalWithLabels, { status: 200 });
};
