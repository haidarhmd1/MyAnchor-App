"use client";

import { useFormContext, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormFieldType, FormJournalType } from "../helper";
import { Spinner } from "@/components/Spinner/Spinner";

type Props = {
  onNext(): void;
  onPrev?: () => void;
  fieldName: keyof FormJournalType;
  options: FormFieldType[];
};

export const MultipleChoice = ({ onNext, options, fieldName }: Props) => {
  const { control, formState } = useFormContext<FormJournalType>();

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
            <Card
              key={option.id}
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "cursor-pointer p-2 transition-all duration-200 hover:shadow-md",
                checked
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "hover:border-muted-foreground/50",
              )}
            >
              <CardContent className="p-2">
                <div className="flex items-start space-x-3">
                  {/* Checkbox visual */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
                      checked
                        ? "border-blue-500 bg-blue-500"
                        : "border-muted-foreground/30 bg-transparent",
                    )}
                  >
                    {/* checkmark */}
                    {checked && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3 text-white"
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

                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-base",
                        checked ? "text-blue-700" : "text-foreground",
                      )}
                    >
                      {option.label}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        checked ? "text-blue-600" : "text-muted-foreground",
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
            disabled={selected.length === 0}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
