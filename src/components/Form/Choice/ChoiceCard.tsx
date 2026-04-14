"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChoiceCardProps = {
  checked: boolean;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  type?: "single" | "multiple";
  onSelect: () => void;
  className?: string;
};

export function ChoiceCard({
  checked,
  label,
  description,
  disabled,
  type = "multiple",
  onSelect,
  className,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      role={type === "multiple" ? "checkbox" : "radio"}
      aria-checked={checked}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "block w-full rounded-md text-left",
        "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
        "animate-[fadeUp_.35s_ease-out_both] will-change-transform motion-reduce:animate-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <Card
        className={cn(
          "border-border rounded-xl p-2 shadow-sm transition-all duration-200",
          "hover:-translate-y-px hover:shadow-md active:scale-[0.98]",
          checked ? "border-primary bg-accent" : "bg-card hover:bg-muted/40",
        )}
      >
        <CardContent className="p-2">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
                type === "multiple" ? "rounded" : "rounded-full",
                checked
                  ? "border-primary bg-primary"
                  : "border-border bg-transparent",
              )}
            >
              {checked ? (
                type === "multiple" ? (
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
                ) : (
                  <div className="bg-primary-foreground h-2.5 w-2.5 rounded-full" />
                )
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-foreground text-base font-medium">
                {label}
              </div>

              {description ? (
                <div className="text-muted-foreground mt-1 text-sm leading-6">
                  {description}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
