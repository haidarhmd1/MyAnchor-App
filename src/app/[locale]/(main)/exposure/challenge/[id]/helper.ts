import { TaxonomyType } from "@prisma/client";
import prisma from "../../../../../../../lib/prisma";

export const getTaxonomies = async () => {
  const taxonomies = await prisma.taxonomyItem.findMany();

  const skippedChallengeReasonsOptions = taxonomies.filter(
    (c) => c.type === TaxonomyType.SKIPPED_CHALLENGE_REASON,
  );
  const stopReasonOptions = taxonomies.filter(
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

  return {
    skippedChallengeReasonsOptions,
    stopReasonOptions,
    afterAttackActionsOptions,
    symptomOptions,
    keptGoingReasonsOptions,
  };
};
