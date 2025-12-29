import { TaxonomyType } from "@prisma/client";
import prisma from "../../../../../../lib/prisma";
import ChallengeForm from "./_components/ChallengeForm";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("challengePlanner");

  const challenges = await prisma.taxonomy.findMany({
    select: {
      id: true,
      type: true,
      slug: true,
      description: true,
      difficulty: true,
    },
    where: { type: TaxonomyType.CHALLENGE },
  });

  if (!challenges || challenges.length === 0) {
    return (
      <div className="p-4">
        <h5>{t("eyebrow")}</h5>
        <h2>{t("title")}</h2>
        <div className="pt-8">
          <h2>{t("error")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h5>{t("eyebrow")}</h5>
      <h2>{t("title")}</h2>
      <div className="pt-8">
        <ChallengeForm challenges={challenges} />
      </div>
    </div>
  );
}
