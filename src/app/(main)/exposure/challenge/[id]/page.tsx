import prisma from "../../../../../../lib/prisma";
import { ResultForm } from "./_components/ResultForm";
import { notFound } from "next/navigation";
import { TaxonomyType } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  const challenge = await prisma.challenge.findFirstOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      challengeOption: {
        select: { label: true },
      },
    },
  });
  const challengeOption = challenge.challengeOption;

  const taxonomies = await prisma.taxonomy.findMany({});

  const skippedChallengeReasonsOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.SKIPPED_CHALLENGE_REASON,
  );
  const stopReasonsOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.STOP_REASON,
  );
  const afterAttackActionsOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.AFTER_ATTACK_ACTION,
  );
  const symptomOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.SYMPTOM,
  );
  const keptGoingReasonsOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.KEPT_GOING_REASON,
  );

  return (
    <div className="p-4">
      <div className="text-center">
        <h5>Tell us</h5>
        <h2>
          How was your experience with the challenge &quot;
          {challengeOption.label}
          &quot;
        </h2>
      </div>
      <div className="pt-4">
        <ResultForm
          challengeId={challenge.id}
          skippedChallengeReasonsOptions={skippedChallengeReasonsOptions}
          stopReasonsOptions={stopReasonsOptions}
          afterAttackActionsOptions={afterAttackActionsOptions}
          symptomOptions={symptomOptions}
          keptGoingReasonsOptions={keptGoingReasonsOptions}
        />
      </div>
    </div>
  );
}
