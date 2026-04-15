import { Metadata } from "next";
import { DateTime } from "luxon";
import { TZ } from "@/lib/timezone";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPastEntries } from "./helper";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { formatRelative } from "@/i18n/relative-time";
import { SignInOverlayButton } from "@/components/SignInOverlayButton/SignInOverlayButton";
import { getUser } from "@/lib/auth/auth-helpers";
import { NewMomentLogEntryButton } from "./_components/NewMomentLogEntryButton";
import { Plus, Trash2Icon } from "lucide-react";
import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { MomentLogCard } from "./_components/MomentLogCard";

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

export default async function Page() {
  const isUserAuth = await getUser();
  return isUserAuth ? <MomentLog /> : <UnauthenticatedMomentLog />;
}

const UnauthenticatedMomentLog = async () => {
  const t = await getTranslations();

  return (
    <section className="bg-background text-foreground space-y-4 px-4 py-4">
      <Card className="border-border bg-card border shadow-sm active:scale-[0.98]">
        <CardContent className="p-4">
          <p className="text-muted-foreground text-sm leading-6">
            {t("momentLog.noEntries")}
          </p>
        </CardContent>
      </Card>

      <SignInOverlayButton>
        <div className="h-96 w-full">
          <div className="border-border bg-card mt-6 rounded-4xl border border-dashed shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="bg-accent text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                <Plus className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-foreground text-base font-semibold">
                  {t("momentLog.entry.title")}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </SignInOverlayButton>
    </section>
  );
};

const MomentLog = async () => {
  const t = await getTranslations();
  const locale = await getLocale();
  const isRtl = locale.startsWith("ar");

  const user = await requireAuth();
  const pastEntries = await getPastEntries(user.id);

  if (pastEntries.length === 0) {
    return (
      <section className="bg-background text-foreground space-y-8 px-4 py-4">
        <div className="surface-soft rounded-3xl p-4 shadow-sm">
          <h3 className="text-foreground text-base font-semibold">
            {t("momentLog.disclaimer.title")}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm leading-6">
            {t("momentLog.disclaimer.description")}
          </p>
        </div>

        <NewMomentLogEntryButton />

        <Card className="border-border bg-card border shadow-sm active:scale-[0.98]">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm leading-6">
              {t("momentLog.noEntries")}
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

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
    <section className="bg-background text-foreground space-y-8 px-4 py-4">
      <div className="surface-soft rounded-3xl p-4 shadow-sm">
        <h3 className="text-foreground text-base font-semibold">
          {t("momentLog.disclaimer.title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {t("momentLog.disclaimer.description")}
        </p>
      </div>

      <NewMomentLogEntryButton />

      <div className="space-y-8 pt-2">
        {order.map((groupKey) => {
          const items = groups[groupKey];
          if (!items.length) return null;

          return (
            <section
              key={groupKey}
              dir={isRtl ? "rtl" : "ltr"}
              className={cn(
                "space-y-3",
                groupTone(groupKey),
                "animate-[fadeUp_.35s_ease-out_both] motion-reduce:animate-none",
              )}
            >
              <div className="sticky top-0 z-20">
                <div className="bg-background/85 border-border flex w-full items-center justify-between rounded-3xl border px-3 py-2 shadow-sm backdrop-blur-md">
                  <h3
                    className={cn(
                      "text-foreground text-sm font-semibold tracking-wide",
                      isRtl ? "mr-1" : "ml-1",
                    )}
                  >
                    {t(`common.groups.${groupKey}`)}
                  </h3>

                  <span className="bg-card text-muted-foreground border-border rounded-full border px-2 py-0.5 text-[11px] font-medium">
                    {items.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((pastEntry) => {
                  const relative = formatRelative(
                    t,
                    locale,
                    pastEntry.createdAt,
                  );

                  const subtitle = `${DateTime.fromJSDate(pastEntry.createdAt)
                    .setZone(TZ)
                    .toFormat("yyyy LLL dd - HH:mm")} • ${relative}`;

                  return (
                    <MomentLogCard
                      key={pastEntry.id}
                      id={pastEntry.id}
                      subtitle={subtitle}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Moment Log",
};
