import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { mapTaxonomyToFormField } from "@/i18n/taxonomy-mapper";
import { DateTime } from "luxon";
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

export const PastChallenges = async () => {
  const t = await getTranslations();
  const locale = await getLocale();

  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      challengeOption: {
        select: {
          id: true,
          type: true,
          slug: true,
          description: true,
          createdAt: true,
          difficulty: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (pastChallenges.length === 0) {
    return (
      <Card className={cn("mt-4 border-2 bg-white")}>
        <CardContent className="flex flex-row gap-2">
          <p>{t("exposure.pastChallenges.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  // group
  const groups: Record<GroupKey, typeof pastChallenges> = {
    today: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: [],
  };

  for (const item of pastChallenges) {
    const key = getGroupKey(item.challengeOption.createdAt, locale);
    groups[key].push(item);
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
    <div className="space-y-6">
      {order.map((groupKey) => {
        const items = groups[groupKey];
        if (!items.length) return null;

        return (
          <section
            key={groupKey}
            className={cn("space-y-3", groupTone(groupKey))}
          >
            <div
              className={cn(
                "sticky top-0 z-20 -mx-2 w-full px-2 py-2",
                "rounded-4xl border",
                "supports-backdrop-filter:bg-white/50",
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

            <div className="space-y-3">
              {items.map(({ id, challengeOption }) => {
                const { label, description } =
                  mapTaxonomyToFormField(challengeOption);

                const dateText = DateTime.fromJSDate(challengeOption.createdAt)
                  .setLocale(locale)
                  .toLocaleString(DateTime.DATE_MED);

                const relative = formatRelative(
                  t,
                  locale,
                  challengeOption.createdAt,
                );

                return (
                  <Card
                    key={id}
                    className={cn(
                      "group border-2 border-dashed border-green-300 bg-linear-to-br from-green-100 to-green-200 p-0",
                      "shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-all",
                      "focus-within:ring-2 hover:-translate-y-px hover:border-green-400",
                      "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
                    )}
                  >
                    <CardContent className="flex flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs">{t(label)}</p>
                          <p className="text-xs opacity-80">
                            {dateText} • {relative}
                          </p>
                        </div>

                        <p className="text-xs font-bold">
                          {t(`difficulty.${challengeOption.difficulty}`)}
                        </p>
                      </div>

                      {description ? (
                        <p className="text-md">{t(description)}</p>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export const UnauthenticatedPastChallenges = async () => {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <Card className={cn("mt-4 border-2 bg-white")}>
      <CardContent className="flex flex-row gap-2">
        <p>{t("exposure.pastChallenges.empty")}</p>
      </CardContent>
    </Card>
  );
};
