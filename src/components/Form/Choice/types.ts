import * as React from "react";

export type ChoiceOption<T extends string = string> = {
  id: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};
