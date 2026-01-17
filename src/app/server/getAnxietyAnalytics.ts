import "server-only";
import { DateTime } from "luxon";
import prisma from "../../../lib/prisma";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";

export async function getAnxietyAnalytics(startDateISO?: string | null) {
  const { userId } = await getUserOrThrow();
  const start = startDateISO
    ? DateTime.fromISO(startDateISO).startOf("month")
    : DateTime.now().startOf("month");

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

  if (anxietyAttackJournal.length === 0) {
    return [];
  }

  const taxonomy = await prisma.taxonomy.findMany({
    select: { id: true, type: true, label: true },
  });

  // Faster lookups than repeated .find()
  const taxonomyById = new Map(taxonomy.map((t) => [t.id, t]));

  const journalWithLabels = anxietyAttackJournal.map((a) => ({
    id: a.id,
    date: a.createdAt.toISOString(),
    typesOfBodySymptoms: a.typesOfBodySymptoms
      .map((symptomId: string) => taxonomyById.get(symptomId) ?? null)
      .filter(Boolean),
    typesOfSituationYouWereIn: a.typesOfSituationYouWereIn
      ? (taxonomyById.get(a.typesOfSituationYouWereIn) ?? null)
      : null,
  }));

  return journalWithLabels;
}
