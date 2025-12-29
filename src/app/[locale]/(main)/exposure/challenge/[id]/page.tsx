import { ResultForm } from "./_components/ResultForm";
import { notFound } from "next/navigation";
import { getTaxonomies } from "./helper";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  const t = await getTranslations("challengeResult");
  const taxonomies = await getTaxonomies();

  return (
    <div className="p-4">
      <div className="text-center">
        <h5>{t("eyebrow")}</h5>
        <h2>{t("title")}</h2>
      </div>

      <div className="pt-4">
        <ResultForm
          challengeId={id}
          skippedChallengeReasonsOptions={
            taxonomies.skippedChallengeReasonsOptions
          }
          stopReasonsOptions={taxonomies.stopReasonsOptions}
          afterAttackActionsOptions={taxonomies.afterAttackActionsOptions}
          symptomOptions={taxonomies.symptomOptions}
          keptGoingReasonsOptions={taxonomies.keptGoingReasonsOptions}
        />
      </div>
    </div>
  );
}
