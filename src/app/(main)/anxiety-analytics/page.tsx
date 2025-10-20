import prisma from "../../../../lib/prisma";
import { Metadata } from "next";
import { Analytics } from "./_components/Analytics";
import { DateTime } from "luxon";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function Page() {
  // Middleware already blocked unauth/soft-deleted users.
  const userSession = await requireAuth(); // optional callback
  const userId = userSession.id!;

  const [journalWithLabels, dateRange] = await Promise.all([
    getFirstLoadAnxietyAnalyticsRow(userId),
    dateRangeFn(userId),
  ]);

  if (journalWithLabels.length === 0) {
    return (
      <div className="p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="default"></EmptyMedia>
            <EmptyTitle>No entries</EmptyTitle>
            <EmptyDescription>
              Journal analytics provide insights into your anxiety patterns over
              time. By logging entries, you can track symptoms, situations, and
              trends to better understand your mental health journey.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="lg" className="w-full max-w-xs">
              <Link href="/journal">Log Journal</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Analytics journalWithLabels={journalWithLabels} dateRange={dateRange} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - User Analytics",
};

function toMonthISO(month: number, year: number): string {
  const m = String(month).padStart(2, "0");
  return `${year}-${m}-01`;
}

async function dateRangeFn(userId: string) {
  const anxietyRange = await prisma.journal.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (anxietyRange.length === 0) return [];

  const uniqueMonths = new Set<string>();
  anxietyRange.forEach((entry) => {
    const month = entry.createdAt.getMonth() + 1;
    const year = entry.createdAt.getFullYear();
    uniqueMonths.add(`${year}-${month}`);
  });

  return Array.from(uniqueMonths).map((item) => {
    const [year, month] = item.split("-").map(Number);
    return { month, year };
  });
}

async function getFirstLoadAnxietyAnalyticsRow(userId: string) {
  {
    const dRange = await dateRangeFn(userId);

    if (dRange.length === 0) return [];

    const start = DateTime.fromISO(
      toMonthISO(Number(dRange[0].month), Number(dRange[0].year)),
    );
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

    if (anxietyAttackJournal.length === 0) return [];

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
      typesOfSituationYouWereIn: a.typesOfSituationYouWereIn.map(
        (situationId: string) => taxonomy.find((t) => t.id === situationId),
      ),
    }));

    console.log(journalWithLabels[0].typesOfBodySymptoms);

    return journalWithLabels;
  }
}
