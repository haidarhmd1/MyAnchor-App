"use client";

import { cn } from "@/lib/utils";
import { ChoiceCard } from "./ChoiceCard";
import { ChoiceOption } from "./types";

type SingleChoiceGroupProps<T extends string = string> = {
  options: ChoiceOption<T>[];
  value?: T | null;
  onChange: (next: T) => void;
  className?: string;
  itemClassName?: string;
};

export function SingleChoiceGroup<T extends string = string>({
  options,
  value,
  onChange,
  className,
  itemClassName,
}: SingleChoiceGroupProps<T>) {
  return (
    <div className={cn("space-y-3", className)} role="radiogroup">
      {options.map((option) => {
        const checked = value === option.id;

        return (
          <ChoiceCard
            key={option.id}
            type="single"
            checked={checked}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            onSelect={() => onChange(option.id)}
            className={itemClassName}
          />
        );
      })}
    </div>
  );
}
