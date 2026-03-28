import { prisma } from "../../../../../../../lib/prisma";
import { ResultForm } from "./_components/ResultForm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const challenge = await prisma.challenge.findFirst({
    where: {
      id,
      deletedAt: null,
      user: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      challengeOption: {
        select: {
          engagement: true,
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  return (
    <section className="bg-background text-foreground px-4 py-4">
      <div className="mx-auto w-full max-w-2xl">
        <ResultForm challengeId={challenge.id} />
      </div>
    </section>
  );
}
