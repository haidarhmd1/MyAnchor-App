"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import z from "zod";
import { useTranslations } from "next-intl";

export function HadCompletedChallenge({
  onNext,
}: {
  onNext(): void;
  onPrev?: () => void;
}) {
  const t = useTranslations("form");
  const { setValue } = useFormContext<z.infer<typeof ChallengeOutcomeSchema>>();

  return (
    <div className="space-y-6 text-center">
      <Image
        className="m-auto"
        alt="panic_attack_illustration"
        src="/illustration/compressed_journal_pa.webp"
        width={200}
        height={200}
      />
      <div className="flex w-full flex-row justify-between p-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("hadCompletedChallenge", true, { shouldDirty: true });
            onNext();
          }}
        >
          {t("yes")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("hadCompletedChallenge", false, { shouldDirty: true });
            onNext();
          }}
        >
          {t("no")}
        </Button>
      </div>
    </div>
  );
}
