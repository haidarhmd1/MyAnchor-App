import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";
import { DateTime } from "luxon";
import { formatRelative } from "@/i18n/relative-time";
import { mapSingleChallengeOptionItemToTranslater } from "@/i18n/challengeoptions-mapper";

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
  const isRtl = locale.includes("ar");
  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      socialContext: true,
      challengeOption: {
        select: {
          id: true,
          engagement: true,
          slug: true,
          description: true,
          createdAt: true,
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
            dir={isRtl ? "rtl" : "ltr"}
            key={groupKey}
            className={cn("space-y-3", groupTone(groupKey))}
          >
            <div
              className={cn(
                "sticky top-0 z-20 w-full px-2 py-2",
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
                const mappedChallengeOptions =
                  mapSingleChallengeOptionItemToTranslater(challengeOption);
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
                    className="group border-0 border-green-300 bg-linear-to-br from-green-200 to-green-400 p-0 shadow-md transition-all"
                  >
                    <CardContent className="flex flex-col gap-4 p-4">
                      <div>
                        <p className="text-xs font-light">
                          {dateText} • {relative}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold">
                          {t(mappedChallengeOptions.label)}
                        </p>
                        {mappedChallengeOptions.description ? (
                          <p className="text-xs">
                            {t(mappedChallengeOptions.description)}
                          </p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold">
                          {t(mappedChallengeOptions.engagement.label)}
                        </p>
                        <p className="text-xs font-medium">
                          {t(mappedChallengeOptions.engagement.title)}
                        </p>
                        <p className="text-xs font-extralight">
                          {t(mappedChallengeOptions.engagement.description)}
                        </p>
                      </div>
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
