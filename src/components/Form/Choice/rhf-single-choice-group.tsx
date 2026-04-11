"use client";

import {
  FieldValues,
  Path,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { SingleChoiceGroup } from "./SingleChoiceGroup";
import { ChoiceOption } from "./types";

type RHFSingleChoiceGroupProps<
  TFieldValues extends FieldValues,
  TOption extends string = string,
> = {
  name: Path<TFieldValues>;
  options: ChoiceOption<TOption>[];
  className?: string;
  itemClassName?: string;
};

export function RHFSingleChoiceGroup<
  TFieldValues extends FieldValues,
  TOption extends string = string,
>({
  name,
  options,
  className,
  itemClassName,
}: RHFSingleChoiceGroupProps<TFieldValues, TOption>) {
  const { control } = useFormContext<TFieldValues>();

  const { field } = useController({
    name,
    control,
  });

  return (
    <SingleChoiceGroup<TOption>
      options={options}
      value={(field.value ?? null) as TOption | null}
      onChange={(next) =>
        field.onChange(next as PathValue<TFieldValues, Path<TFieldValues>>)
      }
      className={className}
      itemClassName={itemClassName}
    />
  );
}
