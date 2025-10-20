import Journal from "./_components/Journal";
import { Metadata } from "next";
import { DateTime } from "luxon";
import { CheckCheck, Frown, SmileIcon } from "lucide-react";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "../_components/ShortcutsCard";
import { NewJournalEntryButton } from "./_components/NewJournalEntryButton";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPastEntries, getTaxonomies, today } from "./helper";

export default async function Page() {
  const { user } = await requireAuth();
  const [taxonomies, pastEntries] = await Promise.all([
    getTaxonomies(),
    getPastEntries(user.id),
  ]);

  if (pastEntries.length > 0) {
    return (
      <div className="p-4">
        <div className="mb-3 flex flex-col justify-center">
          {DateTime.fromJSDate(pastEntries[0].createdAt).toISODate() ===
            today.toISODate() && (
            <ShortcutsCard
              icon={<CheckCheck />}
              title="Your journal entry"
              subtitle={`Entry done! ${DateTime.fromJSDate(
                pastEntries[0].createdAt,
              )
                .setZone(TZ)
                .toFormat("yyyy LLL dd - HH:mm")}`}
              gradient={{
                from: "from-green-500",
                to: !pastEntries[0].hasAnxietyAttack
                  ? "from-sky-500"
                  : "to-amber-600",
              }}
            />
          )}
          <NewJournalEntryButton
            locationOptions={taxonomies.locationOptions}
            avoidanceReasons={taxonomies.avoidanceReasons}
            symptomOptions={taxonomies.symptomOptions}
          />
          {pastEntries.length > 1 && (
            <div className="mt-12">
              <h3 className="text-sm font-light">Past entries:</h3>
              <div className="mt-2 space-y-4">
                {pastEntries.slice(1).map((pE) => (
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Journal
        locationOptions={taxonomies.locationOptions}
        avoidanceReasons={taxonomies.avoidanceReasons}
        symptomOptions={taxonomies.symptomOptions}
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exposure Tracker",
};
