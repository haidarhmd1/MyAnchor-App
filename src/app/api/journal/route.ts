import { JournalFormSchema } from "@/lib/zod.types";
import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import z from "zod";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";

export const GET = async () => {
  const { userId } = await getUserOrThrow();
  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const journal = await prisma.journal.findFirst({
    where: {
      userId,
      deletedAt: null,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ journal }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const { userId } = await getUserOrThrow();
  const body = await request.json();
  const parsed = JournalFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const {
    hasAnxietyAttack,
    hasAvoidedSituations,
    typesOfSituationYouAvoided,
    typesOfSituationYouWereIn,
    whyYouWereAvoidingIt,
    whenDidItHappen,
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
      whyYouWereAvoidingIt,
      whenDidItHappen,
      typesOfBodySymptoms,
      anxietyLevelRating,
    },
  });
  return new Response(JSON.stringify(newJournalEntry), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
