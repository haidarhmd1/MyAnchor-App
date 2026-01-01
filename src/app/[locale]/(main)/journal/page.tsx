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
import { getLocale, getTranslations } from "next-intl/server";
import { formatRelative } from "@/i18n/relative-time";

type GroupKey =
  | "today"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "older";

function getGroupKey(date: Date, locale: string): GroupKey {
  const dt = DateTime.fromJSDate(date).setLocale(locale);
  const now = DateTime.now().setLocale(locale);

  if (dt.hasSame(now, "day")) return "today";

  const startOfThisWeek = now.startOf("week");
  const startOfLastWeek = startOfThisWeek.minus({ weeks: 1 });
  const startOfThisMonth = now.startOf("month");
  const startOfLastMonth = startOfThisMonth.minus({ months: 1 });

  if (dt >= startOfThisWeek) return "thisWeek";
  if (dt >= startOfLastWeek && dt < startOfThisWeek) return "lastWeek";
  if (dt >= startOfThisMonth) return "thisMonth";
  if (dt >= startOfLastMonth && dt < startOfThisMonth) return "lastMonth";

  return "older";
}

function groupTone(groupKey: GroupKey) {
  switch (groupKey) {
    case "today":
    case "thisWeek":
      return "opacity-100";
    case "lastWeek":
      return "opacity-95";
    case "thisMonth":
      return "opacity-90";
    case "lastMonth":
      return "opacity-85 grayscale-[0.05]";
    case "older":
    default:
      return "opacity-75 grayscale-[0.1]";
  }
}

export default async function Page() {
  const t = await getTranslations();
  const locale = await getLocale();

  const { user } = await requireAuth();

  // (No Promise.all — keeps it simple & predictable)
  const taxonomies = await getTaxonomies();
  const pastEntries = await getPastEntries(user.id);

  // Empty state
  if (pastEntries.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-3 flex flex-col justify-center">
          <Card className={cn("mt-4 border-2 bg-white")}>
            <CardContent className="flex flex-row gap-2">
              <p>{t("journal.noEntries")}</p>
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

  const latest = pastEntries[0];
  const isToday =
    DateTime.fromJSDate(latest.createdAt).toISODate() === today.toISODate();

  // We keep your “today shortcut” behavior,
  // but the list below will show the rest grouped.
  const rest = isToday ? pastEntries.slice(1) : pastEntries;

  // group
  const groups: Record<GroupKey, typeof rest> = {
    today: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: [],
  };

  for (const entry of rest) {
    const key = getGroupKey(entry.createdAt, locale);
    groups[key].push(entry);
  }

  const order: GroupKey[] = [
    "today",
    "thisWeek",
    "lastWeek",
    "thisMonth",
    "lastMonth",
    "older",
  ];

  return (
    <div className="p-4">
      <div className="mb-3 flex flex-col justify-center gap-4">
        {isToday && (
          <ShortcutsCard
            icon={<CheckCheck />}
            title={t("journal.entry.title")}
            subtitle={`${t("journal.entry.doneAt")} ${DateTime.fromJSDate(
              latest.createdAt,
            )
              .setZone(TZ)
              .toFormat("yyyy LLL dd - HH:mm")}`}
            gradient={{
              from: "from-green-500",
              to: !latest.hasAnxietyAttack ? "from-sky-500" : "to-amber-600",
            }}
          />
        )}

        <NewJournalEntryButton
          locationOptions={taxonomies.locationOptions}
          avoidanceReasons={taxonomies.avoidanceReasons}
          symptomOptions={taxonomies.symptomOptions}
        />

        {/* Past entries grouped */}
        {rest.length > 0 && (
          <div className="ring-border/50 mt-6 space-y-10 rounded-2xl bg-white/60 p-2 shadow-sm ring-1 dark:bg-zinc-950/40">
            {order.map((groupKey) => {
              const items = groups[groupKey];
              if (!items.length) return null;

              return (
                <section
                  key={groupKey}
                  className={cn(
                    "space-y-3",
                    groupTone(groupKey),
                    "animate-[fadeUp_.35s_ease-out_both] motion-reduce:animate-none",
                  )}
                >
                  {/* Sticky glass header */}
                  <div
                    className={cn(
                      "sticky top-0 z-20 -mx-2 w-full px-2 py-2",
                      "backdrop-blur-md",
                      "bg-white/70 dark:bg-zinc-950/60",
                      "border-border/60 border-b",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <h3 className="text-foreground ml-2 text-sm font-semibold tracking-wide">
                        {t(`common.groups.${groupKey}`)}
                      </h3>

                      <span className="border-border/70 text-foreground/80 rounded-full border bg-white/60 px-2 py-0.5 text-[11px] font-medium dark:bg-zinc-900/40">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pb-4">
                    {items.map((pastEntry) => {
                      const relative = formatRelative(
                        t,
                        locale,
                        pastEntry.createdAt,
                      );

                      return (
                        <div
                          key={pastEntry.id}
                          className={cn(
                            "animate-[fadeUp_.35s_ease-out_both] motion-reduce:animate-none",
                          )}
                        >
                          <ShortcutsCard
                            size="sm"
                            icon={
                              pastEntry.hasAnxietyAttack ? (
                                <Frown />
                              ) : (
                                <SmileIcon />
                              )
                            }
                            title={t("journal.entry.title")}
                            subtitle={`${DateTime.fromJSDate(
                              pastEntry.createdAt,
                            )
                              .setZone(TZ)
                              .toFormat("yyyy LLL dd - HH:mm")} • ${relative}`}
                            gradient={{
                              from: "from-green-500",
                              to: pastEntry.hasAnxietyAttack
                                ? "to-amber-500"
                                : "to-blue-600",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Journal",
};
