import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import { JSONChallengeParse } from "@/common/types";

export const PastChallenges = async () => {
  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
  });

  if (pastChallenges.length > 0) {
    return pastChallenges.map((pC) => {
      const challenge = pC.challengeOption as JSONChallengeParse;
      return (
        <Card key={pC.id} className={cn("mt-4 border-2 bg-green-100")}>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs">{challenge.label}</p>
            <p className="text-md">{challenge.description}</p>
            <p className="text-xs">{challenge.difficulty}</p>
          </CardContent>
        </Card>
      );
    });
  }

  return (
    <Card className={cn("mt-4 border-2 bg-white")}>
      <CardContent className="flex flex-row gap-2">
        <p>No Daily challenges yet done.</p>
      </CardContent>
    </Card>
  );
};
