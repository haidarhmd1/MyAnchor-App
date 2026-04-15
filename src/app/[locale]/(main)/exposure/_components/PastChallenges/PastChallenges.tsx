import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { DateTime } from "luxon";
import { formatRelative } from "@/i18n/relative-time";
import { mapSingleChallengeOptionItemToTranslater } from "@/i18n/challengeoptions-mapper";
import { prisma } from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@/generated/prisma/enums";
import { PastChallengeCard } from "./PastChallengeCard";

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
      return "opacity-85";
    case "older":
    default:
      return "opacity-75";
  }
}

export const PastChallenges = async () => {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRtl = locale.startsWith("ar");

  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      socialContext: true,
      createdAt: true,
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
      <Card className="border-border bg-card mt-4 border shadow-sm active:scale-[0.98]">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm leading-6">
            {t("exposure.pastChallenges.empty")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const groups: Record<GroupKey, typeof pastChallenges> = {
    today: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: [],
  };

  for (const item of pastChallenges) {
    const key = getGroupKey(item.createdAt, locale);
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
            <div className="sticky top-0 z-20">
              <div className="bg-background/85 border-border flex w-full items-center justify-between rounded-3xl border px-3 py-2 shadow-sm backdrop-blur-md">
                <h3 className="text-foreground text-sm font-semibold tracking-wide">
                  {t(`common.groups.${groupKey}`)}
                </h3>

                <span className="bg-card text-muted-foreground border-border rounded-full border px-2 py-0.5 text-[11px] font-medium">
                  {items.length}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {items.map(
                ({ id, createdAt, challengeOption }: (typeof items)[0]) => {
                  const mappedChallengeOptions =
                    mapSingleChallengeOptionItemToTranslater(challengeOption);

                  const dateText = DateTime.fromJSDate(createdAt)
                    .setLocale(locale)
                    .toLocaleString(DateTime.DATE_MED);

                  const relative = formatRelative(t, locale, createdAt);

                  return (
                    <PastChallengeCard
                      key={id}
                      id={id}
                      cardContentHeader={`${dateText} • ${relative}`}
                      label={mappedChallengeOptions.label}
                      description={mappedChallengeOptions.description}
                      engagementLabel={mappedChallengeOptions.engagement.label}
                      engagementTitle={mappedChallengeOptions.engagement.title}
                      engagementDescription={
                        mappedChallengeOptions.engagement.description
                      }
                    />
                  );
                },
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export const UnauthenticatedPastChallenges = async () => {
  const t = await getTranslations();

  return (
    <Card className="border-border bg-card mt-4 border shadow-sm active:scale-[0.98]">
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm leading-6">
          {t("exposure.pastChallenges.empty")}
        </p>
      </CardContent>
    </Card>
  );
};
