"use client";

import { useController, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import z from "zod";
import { momentLogFormSchema } from "@/lib/zod.types";
import { OptionItem } from "../helper";

export const SingleChoice = ({
  onNext,
  fieldName,
  options,
}: {
  onNext(): void;
  onPrev?: () => void;
  fieldName: keyof z.infer<typeof momentLogFormSchema>;
  options: OptionItem[];
}) => {
  const t = useTranslations();
  const { control, formState } =
    useFormContext<z.infer<typeof momentLogFormSchema>>();

  const { field } = useController({
    name: fieldName,
    control,
  });

  const hasSelection =
    field.value !== undefined &&
    field.value !== null &&
    String(field.value) !== "";

  return (
    <div className="space-y-4">
      <div className="space-y-3" role="radiogroup">
        {options.map((option) => {
          const isSelected = String(field.value) === option.slug;
          return (
            <Card
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => field.onChange(option.slug)}
              className={cn(
                "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
                "cursor-pointer p-2 transition-all duration-200 hover:shadow-md",
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "hover:border-muted-foreground/50",
              )}
            >
              <CardContent className="p-2">
                <div className="flex items-start space-x-3">
                  {/* Radio visual */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-blue-500"
                        : "border-muted-foreground/30",
                    )}
                  >
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-colors",
                        isSelected ? "bg-blue-500" : "bg-transparent",
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3
                      className={cn(
                        "text-base",
                        isSelected ? "text-blue-700" : "text-foreground",
                      )}
                    >
                      {t(
                        `momentLog.steps.${fieldName}.options.${option.slug}.title`,
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-2 text-right">
        {formState.isSubmitting ? (
          <Button disabled className="bg-blue-500 hover:bg-blue-600">
            <Spinner />
            <span>{t("form.submitting")}</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!hasSelection}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t("form.next")}
          </Button>
        )}
      </div>
    </div>
  );
};
