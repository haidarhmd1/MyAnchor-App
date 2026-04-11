"use client";

import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { SafetyBehaviorOptionItem } from "@/common/const/SafetyBehavior";
import { SingleChoiceGroup } from "@/components/Form/Choice";
import { useMemo } from "react";

type FormValues = z.infer<typeof ChallengeOutcomeSchema>;

type Props = {
  onNext(): void;
  fieldName: keyof FormValues;
  options: SafetyBehaviorOptionItem[];
};

export function SingleChoice({ onNext, fieldName, options }: Props) {
  const t = useTranslations();
  const { control, formState } = useFormContext<FormValues>();

  const { field } = useController({
    name: fieldName,
    control,
  });

  const hasSelection =
    field.value !== undefined &&
    field.value !== null &&
    String(field.value) !== "";

  const mappedOptions = useMemo(
    () =>
      options.map((o) => ({
        id: o.id,
        label: t(`${fieldName}.options.${o.slug}.title`),
      })),
    [options, t],
  );
  return (
    <div className="space-y-4">
      <SingleChoiceGroup
        options={mappedOptions}
        value={field.value}
        onChange={field.onChange}
      />

      <div className="pt-2 text-right">
        {formState.isSubmitting ? (
          <Button
            disabled
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!hasSelection}
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            {t("form.next")}
          </Button>
        )}
      </div>
    </div>
  );
}
