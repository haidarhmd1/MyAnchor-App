import { Award, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

import prisma from "../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { StartChallengeBtn } from "../exposure/_components/NewChallenge/StartChallengeBtn";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
        <div className="">
          <h4 className="text-md font-bold">
            {t("home.todaysChallenge.title")}
          </h4>
          <p className="text-xs font-thin">
            {t("home.todaysChallenge.description")}
          </p>
        </div>
        <div className="rounded-xl bg-white p-2 shadow-2xl">
          <p className="text-sm font-light">
            {t("dailyChallenge.startNew.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          className="w-full rounded-2xl bg-blue-400 transition will-change-transform active:scale-[0.98]"
        >
          <Link href="/exposure/challenge">{t("tracker.start")}</Link>
        </Button>
      </div>
    );
  }

  switch (latestChallenge.status) {
    case ChallengeStatus.NOT_STARTED:
      return (
        <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
          <div className="">
            <h4 className="text-md font-bold">
              {t("home.todaysChallenge.title")}
            </h4>
            <p className="text-xs font-thin">
              {t("home.todaysChallenge.description")}
            </p>
          </div>

          <StartChallengeBtn
            challengeId={latestChallenge.id}
            pathToRevalidate="/exposure"
          />
        </div>
      );

    case ChallengeStatus.STARTED:
      return (
        <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
          <div className="">
            <h4 className="text-md font-bold">
              {t("home.todaysChallenge.title")}
            </h4>
            <p className="text-xs font-thin">
              {t("home.todaysChallenge.description")}
            </p>
          </div>
          <Link
            href={`/exposure/challenge/${latestChallenge.id}`}
            className="focus:outline-none"
            style={{ display: "contents" }}
            aria-label={t("exposure.newChallenge.pending.aria")}
          >
            <Card
              className={cn(
                "group mt-4 border-2 border-dashed border-amber-300 bg-linear-to-br from-amber-100 to-amber-200",
                "shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-all",
                "focus-within:ring-2 hover:-translate-y-px hover:border-amber-400",
                "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
              )}
              aria-label={t("exposure.newChallenge.pending.aria")}
            >
              <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                <div className="text-foreground/80 shrink-0">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-foreground/80 text-sm leading-none font-light">
                    {t("exposure.newChallenge.pending.title")}
                  </h5>
                  <h4 className="text-base font-semibold">
                    {t("exposure.newChallenge.pending.subtitle")}
                  </h4>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      );

    case ChallengeStatus.FINISHED:
      return (
        <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
          <div className="">
            <h4 className="text-md font-bold">
              {t("home.todaysChallenge.title")}
            </h4>
            <p className="text-xs font-thin">
              {t("home.todaysChallenge.description")}
            </p>
          </div>

          <Link className="block focus:outline-none" href="/exposure/challenge">
            <ShortcutsCard
              title={t("exposure.newChallenge.dailyChallenge.done.title")}
              subtitle={t("exposure.newChallenge.dailyChallenge.done.subtitle")}
              icon={<CheckCheck className="h-5 w-5" aria-hidden="true" />}
              gradient={{
                from: "from-green-600",
                to: "to-green-300",
              }}
            />
          </Link>
        </div>
      );

    default:
      return (
        <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
          <div className="">
            <h4 className="text-md font-bold">
              {t("home.todaysChallenge.title")}
            </h4>
            <p className="text-xs font-thin">
              {t("home.todaysChallenge.description")}
            </p>
          </div>
          <div className="rounded-xl bg-white p-2 shadow-2xl">
            <p className="text-sm font-light">
              {t("dailyChallenge.startNew.subtitle")}
            </p>
          </div>
          <Button
            type="button"
            className="w-full rounded-2xl bg-blue-400 transition will-change-transform active:scale-[0.98]"
          >
            <Link href="/exposure/challenge">{t("tracker.start")}</Link>
          </Button>
        </div>
      );
  }
};

export const UnauthenticatedDailyChallenge = async () => {
  const t = await getTranslations();

  return (
    <div className="space-y-6 rounded-3xl bg-blue-100 p-4 shadow-md">
      <div>
        <h4 className="text-md font-bold">{t("home.todaysChallenge.title")}</h4>
        <p className="text-xs font-thin">
          {t("home.todaysChallenge.description")}
        </p>
      </div>

      <div className="rounded-xl bg-white p-2 shadow-2xl">
        <p className="text-sm font-light">
          {t("dailyChallenge.startNew.subtitle")}
        </p>
      </div>
      <div className="mt-6">
        <Button
          type="button"
          className="w-full rounded-2xl bg-blue-400 transition will-change-transform active:scale-[0.98]"
        >
          <Link href="/exposure/challenge">{t("tracker.start")}</Link>
        </Button>
      </div>
    </div>
  );
};
