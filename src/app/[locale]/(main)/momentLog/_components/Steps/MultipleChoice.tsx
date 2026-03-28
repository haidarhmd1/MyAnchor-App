"use client";

import { useFormContext, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { OptionItem } from "../helper";
import { momentLogFormSchema } from "@/lib/zod.types";

type Props = {
  onNext(): void;
  fieldName: keyof z.infer<typeof momentLogFormSchema>;
  options: OptionItem[];
};

export const MultipleChoice = ({ onNext, options, fieldName }: Props) => {
  const t = useTranslations();
  const { control, formState } =
    useFormContext<z.infer<typeof momentLogFormSchema>>();

  const { field } = useController({
    name: fieldName,
    control,
  });

  const selected: string[] = Array.isArray(field.value) ? field.value : [];
  const isChecked = (id: string) => selected.includes(id);

  const toggleOption = (id: string) => {
    const next = isChecked(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];

    field.onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3" role="group">
        {options.map((option) => {
          const checked = isChecked(option.id);

          return (
            <button
              key={option.id}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggleOption(option.id)}
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
                  checked
                    ? "border-primary bg-accent"
                    : "bg-card hover:bg-muted/40",
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                        checked
                          ? "border-primary bg-primary"
                          : "border-border bg-transparent",
                      )}
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 24 24"
                          className="text-primary-foreground h-3 w-3"
                          aria-hidden="true"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground text-base font-medium">
                        {t(`taxonomy.SYMPTOM.${option.id}.label`)}
                      </h3>

                      {option.descriptionSlug && (
                        <p className="text-muted-foreground mt-1 text-sm leading-6">
                          {t(`taxonomy.SYMPTOM.${option.id}.description`)}
                        </p>
                      )}
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
