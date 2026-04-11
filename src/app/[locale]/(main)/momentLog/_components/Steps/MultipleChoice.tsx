"use client";

import { useFormContext, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { OptionItem } from "../helper";
import { momentLogFormSchema } from "@/lib/zod.types";
import { useMemo } from "react";
import { MultipleChoiceGroup } from "@/components/Form/Choice";

type FormValues = z.infer<typeof momentLogFormSchema>;

type Props = {
  onNext(): void;
  fieldName: keyof FormValues;
  options: OptionItem[];
};

export const MultipleChoice = ({ onNext, options, fieldName }: Props) => {
  const t = useTranslations();
  const { control, formState } = useFormContext<FormValues>();
  const { field } = useController({
    name: fieldName,
    control,
  });
  const selected = Array.isArray(field.value) ? field.value : [];
  const mappedOptions = useMemo(
    () =>
      options.map((o) => ({
        id: o.id,
        label: t(`taxonomy.SYMPTOM.${o.id}.label`),
        description: o.descriptionSlug
          ? t(`taxonomy.SYMPTOM.${o.id}.description`)
          : undefined,
      })),
    [options, t],
  );

  return (
    <div className="space-y-4">
      <MultipleChoiceGroup
        options={mappedOptions}
        value={selected}
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
            disabled={selected.length === 0}
            className="bg-primary text-primary-foreground rounded-2xl hover:opacity-95"
          >
            {t("form.next")}
          </Button>
        )}
      </div>
    </div>
  );
};
