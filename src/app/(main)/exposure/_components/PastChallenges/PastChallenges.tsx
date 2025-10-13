import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";

export const PastChallenges = async () => {
  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      challengeOption: {
        select: {
          label: true,
          description: true,
          difficulty: true,
        },
      },
    },
  });

  if (pastChallenges.length > 0) {
    return pastChallenges.map((pC) => {
      const challenge = pC.challengeOption;
      return (
        <Card
          key={pC.id}
          className={cn(
            "group mt-4 border-2 border-dashed border-green-300 bg-gradient-to-br from-green-100 to-green-200 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-colors focus-within:ring-2 hover:border-green-400",
          )}
        >
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
