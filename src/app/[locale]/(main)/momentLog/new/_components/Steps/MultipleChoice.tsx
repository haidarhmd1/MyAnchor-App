"use client";

import { useFormContext, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { useLocale, useTranslations } from "next-intl";
import { OptionItem } from "../helper";
import { MomentLogFormSchema } from "@/lib/zod.types";
import { useMemo } from "react";
import { MultipleChoiceGroup } from "@/components/Form/Choice";
import { ArrowLeft, ArrowRight } from "lucide-react";

type FormValues = z.infer<typeof MomentLogFormSchema>;

type Props = {
  onNext(): void;
  onPrev(): void;
  fieldName: keyof FormValues;
  options: OptionItem[];
  disableGoBack: boolean;
};

export const MultipleChoice = ({
  onNext,
  onPrev,
  options,
  fieldName,
  disableGoBack,
}: Props) => {
  const t = useTranslations();
  const isRtl = useLocale().startsWith("ar");

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
    <div className="space-y-3">
      <MultipleChoiceGroup
        options={mappedOptions}
        value={selected}
        onChange={field.onChange}
      />

      <div className="bg-background/95 border-t px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={onPrev}
            disabled={disableGoBack}
          >
            {isRtl ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4" />
            )}

            {t("common.previous")}
          </Button>
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
              className="flex-1 rounded-2xl"
              onClick={onNext}
              disabled={selected.length === 0}
            >
              {t("common.analyzeAnswers")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
