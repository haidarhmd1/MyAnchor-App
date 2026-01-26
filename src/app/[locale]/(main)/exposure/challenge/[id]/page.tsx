import { ResultForm } from "./_components/ResultForm";
import { notFound } from "next/navigation";
import prisma from "../../../../../../../lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return notFound();

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

  if (!challenge) return notFound();

  return (
    <div className="p-4">
      <ResultForm challengeId={challenge.id} />
    </div>
  );
}
