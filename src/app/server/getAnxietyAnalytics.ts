import "server-only";
import { DateTime } from "luxon";
import { getUserOrThrow } from "@/lib/auth/auth-helpers";
import { prisma } from "../../../lib/prisma";

export async function getAnxietyAnalytics(startDateISO?: string | null) {
  const { userId } = await getUserOrThrow();
  const start = startDateISO
    ? DateTime.fromISO(startDateISO).startOf("month")
    : DateTime.now().startOf("month");

  const end = start.endOf("month");

  const anxietyAttackmomentLog = await prisma.momentLog.findMany({
    where: {
      userId,
      deletedAt: null,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    select: {
      id: true,
      createdAt: true,
    },
  });

  if (anxietyAttackmomentLog.length === 0) {
    return [];
  }

  const momentLogWithLabels = anxietyAttackmomentLog.map((a) => ({
    id: a.id,
    date: a.createdAt.toISOString(),
  }));

  return momentLogWithLabels;
}
