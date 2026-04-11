"use client";

import {
  FieldValues,
  Path,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { MultipleChoiceGroup } from "./MultipleChoiceGroup";
import { ChoiceOption } from "./types";

type RHFMultipleChoiceGroupProps<
  TFieldValues extends FieldValues,
  TOption extends string = string,
> = {
  name: Path<TFieldValues>;
  options: ChoiceOption<TOption>[];
  className?: string;
  itemClassName?: string;
};

export function RHFMultipleChoiceGroup<
  TFieldValues extends FieldValues,
  TOption extends string = string,
>({
  name,
  options,
  className,
  itemClassName,
}: RHFMultipleChoiceGroupProps<TFieldValues, TOption>) {
  const { control } = useFormContext<TFieldValues>();

  const { field } = useController({
    name,
    control,
  });

  return (
    <MultipleChoiceGroup<TOption>
      options={options}
      value={(Array.isArray(field.value) ? field.value : []) as TOption[]}
      onChange={(next) =>
        field.onChange(next as PathValue<TFieldValues, Path<TFieldValues>>)
      }
      className={className}
      itemClassName={itemClassName}
    />
  );
}
