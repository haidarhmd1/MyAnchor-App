import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import prisma from "../../../../../../../lib/prisma";
import { ChallengeStatus } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { mapTaxonomyToFormField } from "@/i18n/taxonomy-mapper";

export const PastChallenges = async () => {
  const t = await getTranslations();

  const pastChallenges = await prisma.challenge.findMany({
    where: {
      status: ChallengeStatus.FINISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      challengeOption: {
        select: {
          id: true,
          type: true,
          slug: true,
          description: true,
          difficulty: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (pastChallenges.length === 0) {
    return (
      <Card className={cn("mt-4 border-2 bg-white")}>
        <CardContent className="flex flex-row gap-2">
          <p>{t("exposure.pastChallenges.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return pastChallenges.map(({ id, challengeOption }) => {
    const { label, description } = mapTaxonomyToFormField(challengeOption);

    return (
      <Card
        key={id}
        className={cn(
          "group mt-4 border-2 border-dashed border-green-300 bg-gradient-to-br from-green-100 to-green-200 shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-colors focus-within:ring-2 hover:border-green-400",
        )}
      >
        <CardContent className="flex flex-col gap-2 p-4">
          <p className="text-xs">{t(label)}</p>
          {description ? <p className="text-md">{t(description)}</p> : null}
          <p className="text-xs">
            {t(`difficulty.${challengeOption.difficulty}`)}
          </p>
        </CardContent>
      </Card>
    );
  });
};
