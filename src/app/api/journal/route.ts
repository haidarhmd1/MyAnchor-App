import { JournalFormSchema } from "@/lib/zod.types";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/auth-helpers";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import z from "zod";

export const GET = withAuth(async (_request, _ctx, { userId }) => {
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
});

export const POST = withAuth(async (request, _ctx, { userId }) => {
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
