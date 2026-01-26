import { Metadata } from "next";
import { DateTime } from "luxon";
import { CheckCheck, Plus } from "lucide-react";
import { TZ } from "@/lib/timezone";
import ShortcutsCard from "../_components/ShortcutsCard";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPastEntries, today } from "./helper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { formatRelative } from "@/i18n/relative-time";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { getUser } from "@/lib/auth/auth-helpers";
import { NewMomentLogEntryButton } from "./_components/NewMomentLogEntryButton";

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
  const isUserAuth = await getUser();
  return isUserAuth ? <MomentLog /> : <UnauthenticatedMomentLog />;
}

const UnauthenticatedMomentLog = async () => {
  const t = await getTranslations();
  return (
    <div className="p-4">
      <div className="mb-3 flex flex-col justify-center">
        <Card className={cn("mt-4 border-2 bg-white")}>
          <CardContent className="flex flex-row gap-2">
            <p>{t("momentLog.noEntries")}</p>
          </CardContent>
        </Card>

        <SignInOverlayButton>
          <div className="h-96 w-full">
            <Card
              role="button"
              tabIndex={0}
              className={cn(
                "mt-8 border-2 border-dashed p-0 shadow-[0_6px_18px_rgba(0,0,0,0.15)]",
              )}
            >
              <CardContent className="flex flex-row px-0">
                <div className="relative h-full w-full p-3.5 sm:p-4">
                  <div className="flex items-center">
                    <h3 className="truncate align-middle leading-snug font-medium text-black drop-shadow">
                      {t("momentLog.entry.title")}
                    </h3>

                    <div
                      className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/35 shadow-inner backdrop-blur-[2px]"
                      aria-hidden
                    >
                      <div className="text-black drop-shadow">
                        <Plus size={16} strokeWidth={2.25} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SignInOverlayButton>
      </div>
    </div>
  );
};

const MomentLog = async () => {
  const t = await getTranslations();
  const locale = await getLocale();

  const user = await requireAuth();
  const pastEntries = await getPastEntries(user.id);

  // Empty state
  if (pastEntries.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-3 flex flex-col justify-center">
          <div className="rounded-3xl border border-amber-300 bg-white p-4 shadow-md">
            <h3>{t("momentLog.disclaimer.title")}</h3>
            <p className="text-sm font-light">
              {t("momentLog.disclaimer.description")}
            </p>
          </div>

          <NewMomentLogEntryButton />
          <div className="mt-8 rounded-2xl border bg-white p-4 shadow-md">
            <p>{t("momentLog.noEntries")}</p>
          </div>
        </div>
      </div>
    );
  }

  // group
  const groups: Record<GroupKey, typeof pastEntries> = {
    today: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: [],
  };

  for (const entry of pastEntries) {
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
      <div className="rounded-3xl border border-amber-300 bg-white p-4 shadow-md">
        <h3 className="text-md font-medium">
          {t("momentLog.disclaimer.title")}
        </h3>
        <p className="text-xs font-light">
          {t("momentLog.disclaimer.description")}
        </p>
      </div>
      <div className="mb-3 flex flex-col justify-center gap-4">
        <NewMomentLogEntryButton />

        {/* Past entries grouped */}
        {pastEntries.length > 0 && (
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
                            title={t("momentLog.entry.title")}
                            subtitle={`${DateTime.fromJSDate(
                              pastEntry.createdAt,
                            )
                              .setZone(TZ)
                              .toFormat("yyyy LLL dd - HH:mm")} • ${relative}`}
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
};

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Moment Log",
};
