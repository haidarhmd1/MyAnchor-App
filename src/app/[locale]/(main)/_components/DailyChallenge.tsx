import { Award, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { StartChallengeBtn } from "../exposure/_components/NewChallenge/StartChallengeBtn";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "../../../../../lib/prisma";
import { ChallengeStatus } from "@/generated/prisma/enums";

const DailyChallengeShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="surface-soft space-y-6 rounded-3xl p-4 shadow-sm">
      <div className="space-y-1">
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          {title}
        </h4>
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      </div>

      {children}
    </section>
  );
};

const DailyChallengeInfoCard = ({ text }: { text: string }) => {
  return (
    <div className="surface-muted rounded-2xl p-3">
      <p className="text-muted-foreground text-sm leading-6">{text}</p>
    </div>
  );
};

const DailyChallengePrimaryButton = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Button
      type="button"
      className="bg-primary text-primary-foreground w-full rounded-2xl transition will-change-transform hover:opacity-95 active:scale-[0.98]"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export const DailyChallenge = async () => {
  const t = await getTranslations();

  const latestChallenge = await prisma.challenge.findFirst({
    where: {
      deletedAt: null,
      status: { not: ChallengeStatus.FINISHED },
    },
    select: {
      id: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!latestChallenge) {
    return (
      <DailyChallengeShell
        title={t("home.todaysChallenge.title")}
        description={t("home.todaysChallenge.description")}
      >
        <DailyChallengeInfoCard text={t("dailyChallenge.startNew.subtitle")} />
        <DailyChallengePrimaryButton
          href="/exposure/challenge"
          label={t("tracker.start")}
        />
      </DailyChallengeShell>
    );
  }

  switch (latestChallenge.status) {
    case ChallengeStatus.NOT_STARTED:
      return (
        <DailyChallengeShell
          title={t("home.todaysChallenge.title")}
          description={t("home.todaysChallenge.description")}
        >
          <StartChallengeBtn
            challengeId={latestChallenge.id}
            pathToRevalidate="/exposure"
          />
        </DailyChallengeShell>
      );

    case ChallengeStatus.STARTED:
      return (
        <DailyChallengeShell
          title={t("home.todaysChallenge.title")}
          description={t("home.todaysChallenge.description")}
        >
          <Link
            href={`/exposure/challenge/${latestChallenge.id}`}
            className="focus:outline-none"
            style={{ display: "contents" }}
            aria-label={t("exposure.newChallenge.pending.aria")}
          >
            <Card
              className={cn(
                "bg-accent text-accent-foreground border-border group mt-1 rounded-2xl border",
                "shadow-sm transition-all",
                "focus-within:ring-ring focus-within:ring-2 hover:-translate-y-px hover:shadow-md",
                "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
              )}
              aria-label={t("exposure.newChallenge.pending.aria")}
            >
              <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                <div className="text-primary shrink-0">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="space-y-1">
                  <h5 className="text-muted-foreground text-sm leading-none font-medium">
                    {t("exposure.newChallenge.pending.title")}
                  </h5>
                  <h4 className="text-foreground text-base font-semibold">
                    {t("exposure.newChallenge.pending.subtitle")}
                  </h4>
                </div>
              </CardContent>
            </Card>
          </Link>
        </DailyChallengeShell>
      );

    case ChallengeStatus.FINISHED:
      return (
        <DailyChallengeShell
          title={t("home.todaysChallenge.title")}
          description={t("home.todaysChallenge.description")}
        >
          <Link className="block focus:outline-none" href="/exposure/challenge">
            <ShortcutsCard
              title={t("exposure.newChallenge.dailyChallenge.done.title")}
              subtitle={t("exposure.newChallenge.dailyChallenge.done.subtitle")}
              icon={<CheckCheck className="h-5 w-5" aria-hidden="true" />}
            />
          </Link>
        </DailyChallengeShell>
      );

    default:
      return (
        <DailyChallengeShell
          title={t("home.todaysChallenge.title")}
          description={t("home.todaysChallenge.description")}
        >
          <DailyChallengeInfoCard
            text={t("dailyChallenge.startNew.subtitle")}
          />
          <DailyChallengePrimaryButton
            href="/exposure/challenge"
            label={t("tracker.start")}
          />
        </DailyChallengeShell>
      );
  }
};

export const UnauthenticatedDailyChallenge = async () => {
  const t = await getTranslations();

  return (
    <DailyChallengeShell
      title={t("home.todaysChallenge.title")}
      description={t("home.todaysChallenge.description")}
    >
      <DailyChallengeInfoCard text={t("dailyChallenge.startNew.subtitle")} />

      <div className="mt-2">
        <DailyChallengePrimaryButton
          href="/exposure/challenge"
          label={t("tracker.start")}
        />
      </div>
    </DailyChallengeShell>
  );
};
