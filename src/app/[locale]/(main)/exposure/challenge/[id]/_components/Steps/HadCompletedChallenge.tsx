"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import z from "zod";
import { useTranslations } from "next-intl";

export function HadCompletedChallenge({ onNext }: { onNext(): void }) {
  const t = useTranslations();
  const { setValue } = useFormContext<z.infer<typeof ChallengeOutcomeSchema>>();

  const handleSelect = (value: boolean) => {
    setValue("hadCompletedChallenge", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    onNext();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSelect(true)}
          className="bg-card hover:bg-accent text-foreground border-border h-auto min-h-24 rounded-3xl px-5 py-4 text-left"
        >
          <div className="space-y-1">
            <p className="text-base font-semibold">
              {t("challengeSteps.hadCompletedChallenge.answer.stayed")}
            </p>
          </div>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSelect(false)}
          className="bg-card hover:bg-accent text-foreground border-border h-auto min-h-24 rounded-3xl px-5 py-4 text-left"
        >
          <div className="space-y-1">
            <p className="text-base font-semibold">
              {t("challengeSteps.hadCompletedChallenge.answer.leftEarly")}
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
