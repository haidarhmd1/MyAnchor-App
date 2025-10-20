"use client";

import { useController, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Spinner } from "@/components/Spinner/Spinner";
import { WhenDidItHappenType, FormJournalType } from "../helper";

export function SingleChoice({
  onNext,
  fieldName,
  options,
}: {
  onNext(): void;
  onPrev?: () => void;
  fieldName: keyof FormJournalType;
  options: WhenDidItHappenType[];
}) {
  const { control, formState } = useFormContext<FormJournalType>();

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
          const isSelected = String(field.value) === option.id;
          return (
            <Card
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => field.onChange(Number(option.id))}
              className={cn(
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
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
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
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-base",
                        isSelected ? "text-blue-700" : "text-foreground",
                      )}
                    >
                      {option.label}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        isSelected ? "text-blue-600" : "text-muted-foreground",
                      )}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Optional step-level Next */}
      <div className="pt-2 text-right">
        {formState.isSubmitting ? (
          <Button disabled className="bg-blue-500 hover:bg-blue-600">
            <Spinner />
            <span>Submitting</span>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!hasSelection}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
