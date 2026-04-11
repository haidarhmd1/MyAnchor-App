"use client";

import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import z from "zod";
import { momentLogFormSchema } from "@/lib/zod.types";
import { OptionItem } from "../helper";
import { useMemo } from "react";
import { SingleChoiceGroup } from "@/components/Form/Choice";

type FormValues = z.infer<typeof momentLogFormSchema>;

type Props = {
  onNext(): void;
  fieldName: keyof FormValues;
  options: OptionItem[];
};

export const SingleChoice = ({ onNext, fieldName, options }: Props) => {
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
        label: t(`momentLog.steps.${fieldName}.options.${o.slug}.title`),
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
};
