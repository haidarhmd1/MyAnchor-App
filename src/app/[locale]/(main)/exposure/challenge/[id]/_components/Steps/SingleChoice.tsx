"use client";

import { useController, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChallengeOutcomeSchema } from "@/lib/zod.types";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { SafetyBehaviorOptionItem } from "@/common/const/SafetyBehavior";

export function SingleChoice({
  onNext,
  fieldName,
  options,
}: {
  onNext(): void;
  fieldName: keyof z.infer<typeof ChallengeOutcomeSchema>;
  options: SafetyBehaviorOptionItem[];
}) {
  const t = useTranslations();
  const { control, formState } =
    useFormContext<z.infer<typeof ChallengeOutcomeSchema>>();

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
      <div
        className="space-y-3"
        role="radiogroup"
        aria-label={String(fieldName)}
      >
        {options.map((option) => {
          const isSelected = String(field.value) === option.slug;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => field.onChange(option.slug)}
              className={cn(
                "block w-full rounded-4xl text-left",
                "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
                "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
              )}
            >
              <Card
                className={cn(
                  "border-border p-2 shadow-sm transition-all duration-200",
                  "hover:-translate-y-px hover:shadow-md",
                  isSelected
                    ? "border-primary bg-accent"
                    : "bg-card hover:bg-muted/40",
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected ? "border-primary" : "border-border",
                      )}
                    >
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-colors",
                          isSelected ? "bg-primary" : "bg-transparent",
                        )}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground text-base font-medium">
                        {t(`${fieldName}.options.${option.slug}.title`)}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

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
