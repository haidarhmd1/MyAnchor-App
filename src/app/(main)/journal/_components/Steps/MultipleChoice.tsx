"use client";

import { useFormContext, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormFieldType, FormJournalType } from "../helper";

type Props = {
  onNext(): void;
  onPrev?: () => void;
  options: FormFieldType[];
  fieldName: keyof FormJournalType;
};

export function MultipleChoice({
  onNext,
  options: generalOptions,
  fieldName: controlName,
}: Props) {
  const { control } = useFormContext<FormJournalType>();

  const { field } = useController({
    name: controlName,
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
      <div className="space-y-3" role="group" aria-label="Where were you?">
        {generalOptions.map((option) => {
          const checked = isChecked(option.id);
          return (
            <Card
              key={option.id}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleOption(option.id);
                }
              }}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "cursor-pointer p-2 transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                checked
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "hover:border-muted-foreground/50 border-gray-500 bg-gray-50",
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

        {/* Custom input */}
        {/* <Card className="border-muted-foreground/30 border-2 border-dashed p-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Add your own option..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCustomOption();
                  }}
                  className="placeholder:text-muted-foreground border-0 bg-transparent p-0 text-base focus-visible:ring-0"
                />
              </div>
              <Button
                size="sm"
                onClick={handleAddCustomOption}
                disabled={!customInput.trim()}
                className="h-8 w-8 bg-blue-500 p-0 hover:bg-blue-600"
                aria-label="Add custom option"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="pt-2 text-right">
        <Button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
