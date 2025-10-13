import { auth } from "@/lib/auth/auth";
import Journal from "./_components/Journal";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { DateTime } from "luxon";
import { CheckCheck, Frown, SmileIcon } from "lucide-react";
import { TZ } from "@/lib/timezone";
import { TaxonomyType } from "@prisma/client";
import ShortcutsCard from "../_components/ShortcutsCard";
import { NewJournalEntryButton } from "./_components/NewJournalEntryButton";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user || user.deletedAt) {
    redirect("/");
  }

  const taxonomies = await prisma.taxonomy.findMany({});
  const locationOptions = taxonomies.filter(
    (t) => t.type === TaxonomyType.LOCATION,
  );
  const avoidanceReasons = taxonomies.filter(
    (t) => t.type === TaxonomyType.AVOIDANCE_REASON,
  );
  const symptomOptions = taxonomies.filter(
    (t) => t.type === TaxonomyType.SYMPTOM,
  );

  const start = DateTime.now().setZone(TZ).startOf("day");
  const end = start.endOf("day");

  const journalEntry = await prisma.journal.findFirst({
    where: {
      userId: user.id,
      deletedAt: null,
      createdAt: {
        gte: start.toJSDate(),
        lte: end.toJSDate(),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pastEntries = await prisma.journal.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
    },
  });

  if (journalEntry) {
    return (
      <div className="p-4">
        <div className="mb-3 flex flex-col justify-center">
          <ShortcutsCard
            icon={<CheckCheck />}
            title="Your journal entry"
            subtitle={`Entry for today done! ${DateTime.fromJSDate(
              journalEntry.createdAt,
            )
              .setZone(TZ)
              .toFormat("yyyy LLL dd - HH:mm")}`}
            gradient={{
              from: "from-green-500",
              to: !journalEntry.hasAnxietyAttack
                ? "from-sky-500"
                : "to-amber-600",
            }}
          />
          <NewJournalEntryButton
            locationOptions={locationOptions}
            avoidanceReasons={avoidanceReasons}
            symptomOptions={symptomOptions}
          />
          <div className="mt-12">
            <h3 className="text-sm font-light">Past entries:</h3>
            <div className="mt-2 space-y-4">
              {pastEntries.map((pE) => (
                <ShortcutsCard
                  key={pE.id}
                  size="sm"
                  icon={pE.hasAnxietyAttack ? <Frown /> : <SmileIcon />}
                  title="Your journal entry"
                  subtitle={`${DateTime.fromJSDate(pE.createdAt)
                    .setZone(TZ)
                    .toFormat("yyyy LLL dd - HH:mm")}`}
                  gradient={{
                    from: "from-green-500",
                    to: pE.hasAnxietyAttack ? "to-amber-500" : "to-blue-600",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Journal
        locationOptions={locationOptions}
        avoidanceReasons={avoidanceReasons}
        symptomOptions={symptomOptions}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
