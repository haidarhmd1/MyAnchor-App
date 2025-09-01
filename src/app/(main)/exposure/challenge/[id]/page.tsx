import { JSONChallengeParse } from "@/common/types";
import prisma from "../../../../../../lib/prisma";
import { ResultForm } from "./_components/ResultForm";
import { notFound } from "next/navigation";

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
  });
  const challengeOption = challenge.challengeOption as JSONChallengeParse;

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
        <ResultForm challengeId={challenge.id} />
      </div>
    </div>
  );
}
