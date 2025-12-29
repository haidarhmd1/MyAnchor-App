import { Award, BadgePlus, CheckCheck } from "lucide-react";
import Link from "next/link";
import prisma from "../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import ShortcutsCard from "./ShortcutsCard";

export const DailyChallenge = async () => {
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
        aria-label={"Still not set up a daily challenge?"}
      >
        <ShortcutsCard
          title="Start a new Challenge"
          subtitle="Still not set up a daily challenge?"
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
          aria-label={"Daily Challenge Completion Pending"}
        >
          <ShortcutsCard
            title="Daily Challenge Completion Pending"
            subtitle="Did you complete your daily challenge? If so, click here to tell us how it went!"
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
          aria-label="Daily Challenge Done"
        >
          <ShortcutsCard
            title="Daily Challenge Done!"
            subtitle="Amazing! Tap here Start a new one!"
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
          aria-label={"Still not set up a daily challenge?"}
        >
          <ShortcutsCard
            title="Start a new Challenge"
            subtitle="Still not set up a daily challenge?"
            icon={<BadgePlus className="h-5 w-5" aria-hidden="true" />}
          />
        </Link>
      );
  }
};
