"use client";

import { useController, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner/Spinner";
import { useLocale, useTranslations } from "next-intl";
import z from "zod";
import { MomentLogFormSchema } from "@/lib/zod.types";
import { OptionItem } from "../helper";
import { useMemo } from "react";
import { SingleChoiceGroup } from "@/components/Form/Choice";
import { ArrowLeft, ArrowRight } from "lucide-react";

type FormValues = z.infer<typeof MomentLogFormSchema>;

type Props = {
  onNext(): void;
  onPrev(): void;
  fieldName: keyof FormValues;
  options: OptionItem[];
  disableGoBack: boolean;
};

export const SingleChoice = ({
  onNext,
  onPrev,
  disableGoBack,
  fieldName,
  options,
}: Props) => {
  const t = useTranslations();
  const isRtl = useLocale().startsWith("ar");

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
    <div className="space-y-3">
      <SingleChoiceGroup
        options={mappedOptions}
        value={field.value}
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
              disabled={!hasSelection}
              onClick={onNext}
            >
              {t("common.continue")}
              {isRtl ? (
                <ArrowLeft className="mr-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
