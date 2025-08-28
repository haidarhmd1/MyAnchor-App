import { Card, CardContent } from "@/components/ui/card";
import { Award, BadgePlus, CheckCheck } from "lucide-react";
import Link from "next/link";
import prisma from "../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";

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
        <Card
          className={
            "group rounded-4xl border-0 border-cyan-300 bg-cyan-100 transition-colors focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 hover:border-cyan-400"
          }
          aria-label={"Still not set up a daily challenge?"}
        >
          <CardContent className="flex items-start gap-4 p-4 sm:p-5">
            <div className="text-foreground/80 shrink-0">
              <BadgePlus className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h5 className="text-foreground/80 text-sm leading-none font-light">
                {"Start a new Challenge"}
              </h5>
              <h4 className="text-base font-semibold">
                {"Still not set up a daily challenge?"}
              </h4>
            </div>
          </CardContent>
        </Card>
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
          <Card
            className={
              "group rounded-3xl border-2 border-dashed border-amber-300 bg-amber-100 shadow-sm transition-colors focus-within:ring-2 hover:border-amber-400"
            }
            aria-label="Daily Challenge Completion Pending"
          >
            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
              <div className="text-foreground/80 shrink-0">
                <Award className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h5 className="text-foreground/80 text-sm leading-none font-light">
                  Daily Challenge Completion Pending
                </h5>
                <h4 className="text-base font-semibold">
                  Did you complete your daily challenge? If so, click here to
                  tell us how it went!
                </h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    case ChallengeStatus.FINISHED:
      return (
        <Link
          href="/exposure/challenge"
          className="block focus:outline-none"
          aria-label="Daily Challenge Done"
        >
          <Card
            className={
              "group rounded-3xl border-2 border-green-300 bg-green-100 transition-colors focus-within:ring-2"
            }
            aria-label="Daily Challenge Pending"
          >
            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
              <div className="text-foreground/80 shrink-0">
                <CheckCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h5 className="text-foreground/80 text-sm leading-none font-light">
                  Daily Challenge Done!
                </h5>
                <h4 className="text-base font-semibold">
                  Amazing! Tap here Start a new one!
                </h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );

    default:
      return (
        <Link
          href="/exposure/challenge"
          className="block focus:outline-none"
          aria-label={"Still not set up a daily challenge?"}
        >
          <Card
            className={
              "group rounded-3xl border-2 border-cyan-300 bg-cyan-100 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 hover:border-cyan-400"
            }
            aria-label={"Still not set up a daily challenge?"}
          >
            <CardContent className="flex items-start gap-4 p-4 sm:p-5">
              <div className="text-foreground/80 shrink-0">
                <BadgePlus className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h5 className="text-foreground/80 text-sm leading-none font-light">
                  {"Start a new Challenge"}
                </h5>
                <h4 className="text-base font-semibold">
                  {"Still not set up a daily challenge?"}
                </h4>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
  }
};
