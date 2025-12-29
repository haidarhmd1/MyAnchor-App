import { TaxonomyType } from "@prisma/client";
import prisma from "../../../../../../lib/prisma";
import ChallengeForm from "./_components/ChallengeForm";

export default async function Page() {
  const challenges = await prisma.taxonomy.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      difficulty: true,
    },
    where: {
      type: TaxonomyType.CHALLENGE,
    },
  });

  if (!challenges) {
    return (
      <div className="p-4">
        <h5>Planner</h5>
        <h2>Plan your challenge</h2>
        <div className="pt-8">
          <h2>Something wen&apos;t wrong</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h5>Planner</h5>
      <h2>Plan your challenge</h2>
      <div className="pt-8">
        <ChallengeForm challenges={challenges} />
      </div>
    </div>
  );
}
