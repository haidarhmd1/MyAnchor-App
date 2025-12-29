import { Award, BadgePlus, CheckCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

import prisma from "../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import ShortcutsCard from "./ShortcutsCard";
import { getTranslations } from "next-intl/server";

export const DailyChallenge = async () => {
  const t = await getTranslations("dailyChallenge");

  const latestChallenge = await prisma.challenge.findFirst({
    where: {
      deletedAt: null,
      status: ChallengeStatus.NOT_STARTED,
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
      <Link
        href="/exposure/challenge"
        className="block focus:outline-none"
        aria-label={t("startNew.aria")}
      >
        <ShortcutsCard
          title={t("startNew.title")}
          subtitle={t("startNew.subtitle")}
          icon={<BadgePlus className="h-5 w-5" aria-hidden="true" />}
        />
      </Link>
    );
  }

  switch (latestChallenge.status) {
    case ChallengeStatus.NOT_STARTED:
      return (
        <Link
          href={`/exposure/challenge/${latestChallenge.id}`}
          className="block focus:outline-none"
          aria-label={t("pending.aria")}
        >
          <ShortcutsCard
            title={t("pending.title")}
            subtitle={t("pending.subtitle")}
            icon={<Award className="h-5 w-5" aria-hidden="true" />}
            gradient={{
              from: "from-amber-300",
              to: "to-amber-100",
            }}
          />
        </Link>
      );

    case ChallengeStatus.FINISHED:
      return (
        <Link
          href="/exposure/challenge"
          className="block focus:outline-none"
          aria-label={t("done.aria")}
        >
          <ShortcutsCard
            title={t("done.title")}
            subtitle={t("done.subtitle")}
            icon={<CheckCheck className="h-5 w-5" aria-hidden="true" />}
            gradient={{
              from: "from-green-300",
              to: "to-green-100",
            }}
          />
        </Link>
      );

    default:
      return (
        <Link
          href="/exposure/challenge"
          className="block focus:outline-none"
          aria-label={t("startNew.aria")}
        >
          <ShortcutsCard
            title={t("startNew.title")}
            subtitle={t("startNew.subtitle")}
            icon={<BadgePlus className="h-5 w-5" aria-hidden="true" />}
          />
        </Link>
      );
  }
};
