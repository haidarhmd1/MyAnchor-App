import { Award, BadgePlus, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

import prisma from "../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export const DailyChallenge = async () => {
  const t = await getTranslations();

  const latestChallenge = await prisma.challenge.findFirst({
    where: {
      deletedAt: null,
      // status: ChallengeStatus.NOT_STARTED,
    },
    select: {
      id: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
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

          <Link
            className="block focus:outline-none"
            href={`/exposure/challenge/${latestChallenge.id}`}
          >
            <ShortcutsCard
              title={t("dailyChallenge.pending.title")}
              subtitle={t("dailyChallenge.pending.subtitle")}
              icon={<Award className="h-5 w-5" aria-hidden="true" />}
              gradient={{
                from: "from-amber-600",
                to: "to-amber-300",
              }}
            />
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
              title={t("dailyChallenge.done.title")}
              subtitle={t("dailyChallenge.done.subtitle")}
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
