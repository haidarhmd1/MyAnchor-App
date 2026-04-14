import { ArrowLeft, Award, CheckCheck, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { StartChallengeBtn } from "../../../(main)/exposure/_components/NewChallenge/StartChallengeBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "../../../../../../lib/prisma";
import { ChallengeStatus } from "@/generated/prisma/enums";
import { ComponentType } from "react";

const DailyChallengeShell = ({
  title,
  description,
  subDescription,
  icon,
  children,
}: {
  title: string;
  description: string;
  subDescription?: string;
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => {
  const Icon = icon;

  return (
    <Card className="rounded-md p-6">
      <CardHeader>
        {Icon && (
          <div className="bg-accent m-auto flex h-12 w-12 justify-center rounded-full">
            <Icon className="self-center" />
          </div>
        )}
        <div className="mt-4 text-center">
          <h4 className="text-foreground text-sm font-medium">{title}</h4>
          <h2 className="text-lg font-bold">{description}</h2>
          {subDescription && (
            <p className="text-muted-foreground text-xs font-light">
              {subDescription}
            </p>
          )}
        </div>
      </CardHeader>
      <CardDescription className="text-center">{children}</CardDescription>
    </Card>
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
      className="bg-primary text-primary-foreground w-full rounded-sm p-6 transition will-change-transform hover:opacity-95 active:scale-[0.98]"
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
        icon={CheckCircle}
        title={t("home.todaysChallenge.title")}
        description={t("home.todaysChallenge.description")}
        subDescription={t("home.todaysChallenge.subDescription")}
      >
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
                "bg-accent text-accent-foreground border-border group rounded-md border-none p-2",
                "shadow-sm transition-all",
                "focus-within:ring-ring focus-within:ring-2 hover:-translate-y-px hover:shadow-md",
                "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
                "active:scale-[0.98]",
              )}
              aria-label={t("exposure.newChallenge.pending.aria")}
            >
              <CardContent className="flex items-start gap-4 p-2 sm:p-5">
                <div className="text-primary shrink-0">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="space-y-1 text-left">
                  <h5 className="text-foreground text-base font-semibold">
                    {t("exposure.newChallenge.pending.title")}
                  </h5>
                  <p className="text-muted-foreground text-xs font-medium">
                    {t("exposure.newChallenge.pending.subtitle")}
                  </p>
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
