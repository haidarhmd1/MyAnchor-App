import { Metadata } from "next";
import { DateTime } from "luxon";
import { CheckCheck, Frown, SmileIcon } from "lucide-react";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "../_components/ShortcutsCard";
import { NewJournalEntryButton } from "./_components/NewJournalEntryButton";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPastEntries, getTaxonomies, today } from "./helper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
                {pastEntries.slice(1).map((pastEntry) => (
                  <ShortcutsCard
                    key={pastEntry.id}
                    size="sm"
                    icon={
                      pastEntry.hasAnxietyAttack ? <Frown /> : <SmileIcon />
                    }
                    title="Your journal entry"
                    subtitle={`${DateTime.fromJSDate(pastEntry.createdAt)
                      .setZone(TZ)
                      .toFormat("yyyy LLL dd - HH:mm")}`}
                    gradient={{
                      from: "from-green-500",
                      to: pastEntry.hasAnxietyAttack
                        ? "to-amber-500"
                        : "to-blue-600",
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
      <div className="mb-3 flex flex-col justify-center">
        <Card className={cn("mt-4 border-2 bg-white")}>
          <CardContent className="flex flex-row gap-2">
            <p>No Past Entries.</p>
          </CardContent>
        </Card>
        <NewJournalEntryButton
          locationOptions={taxonomies.locationOptions}
          avoidanceReasons={taxonomies.avoidanceReasons}
          symptomOptions={taxonomies.symptomOptions}
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Journal",
};
