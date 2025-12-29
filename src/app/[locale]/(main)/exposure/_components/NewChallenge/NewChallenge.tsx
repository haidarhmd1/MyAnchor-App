import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, BadgePlus } from "lucide-react";
import Link from "next/link";
import prisma from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";

export const NewChallenge = async () => {
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

  if (latestChallenge) {
    return (
      <Link
        href={`/exposure/challenge/${latestChallenge.id}`}
        className="focus:outline-none"
        style={{
          display: "contents",
        }}
        aria-label={"Daily Challenge Completion Pending"}
      >
        <Card
          className={
            "group mt-4 border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-100 to-amber-200 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-colors focus-within:ring-2 hover:border-amber-400"
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
                Did you complete your daily challenge? If so, click here to tell
                us how it went!
              </h4>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href="/exposure/challenge"
      style={{
        display: "contents",
      }}
    >
      <Card className={cn("mt-4 border-2 border-dashed")}>
        <CardContent className="flex flex-row gap-2">
          <div className="shrink-0">
            <BadgePlus />
          </div>
          <p>
            Start a new Challenge either you can start right away or later that
            day it.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
