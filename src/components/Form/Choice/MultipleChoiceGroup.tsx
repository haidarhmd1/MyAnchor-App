"use client";

import { cn } from "@/lib/utils";
import { ChoiceCard } from "./ChoiceCard";
import { ChoiceOption } from "./types";

type MultipleChoiceGroupProps<T extends string = string> = {
  options: ChoiceOption<T>[];
  value: T[];
  onChange: (next: T[]) => void;
  className?: string;
  itemClassName?: string;
};

export function MultipleChoiceGroup<T extends string = string>({
  options,
  value,
  onChange,
  className,
  itemClassName,
}: MultipleChoiceGroupProps<T>) {
  const selected = Array.isArray(value) ? value : [];

  const isChecked = (id: T) => selected.includes(id);

  const toggle = (id: T) => {
    const next = isChecked(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];

    onChange(next);
  };

  return (
    <div className={cn("space-y-3", className)} role="group">
      {options.map((option) => (
        <ChoiceCard
          key={option.id}
          type="multiple"
          checked={isChecked(option.id)}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          onSelect={() => toggle(option.id)}
          className={itemClassName}
        />
      ))}
    </div>
  );
}
