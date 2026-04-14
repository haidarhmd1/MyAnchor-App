import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { AnxietyScreeningInput, Likert0To3 } from "./schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormFieldName } from "../../AnxietyScreeningForm";
import { useLocale, useTranslations } from "next-intl";

export function PreviewTile(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        {props.label}
      </p>
      <p className="mt-1 text-sm font-medium capitalize">{props.value}</p>
    </div>
  );
}

export function FormBooleanCards(props: {
  name: FormFieldName;
  title: string;
}) {
  const t = useTranslations("anxietyScreening");
  const isRtl = useLocale().startsWith("ar");
  const { setValue, control } = useFormContext<AnxietyScreeningInput>();
  const value = useWatch({
    control,
    name: props.name as never,
  }) as unknown as boolean;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{props.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("common.yesNoUnknownLabels.yes"), value: true },
          { label: t("common.yesNoUnknownLabels.no"), value: false },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() =>
              setValue(props.name as never, option.value as never, {
                shouldDirty: true,
              })
            }
            className={cn(
              "rounded-2xl border px-4 py-4 text-sm transition-colors",
              isRtl ? "text-right" : "text-left",
              value === option.value
                ? "border-primary bg-primary/10"
                : "hover:bg-muted/50",
            )}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FormLikertCards(props: {
  name: FormFieldName;
  title: string;
  labels: Record<number, string>;
}) {
  const isRtl = useLocale().startsWith("ar");
  const { setValue, control } = useFormContext<AnxietyScreeningInput>();
  const value = useWatch({
    control,
    name: props.name as never,
  }) as unknown as Likert0To3;
  const t = useTranslations();
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{props.title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              setValue(props.name as never, option as never, {
                shouldDirty: true,
              })
            }
            className={cn(
              "rounded-2xl border px-4 py-4 text-left text-sm transition-colors",
              isRtl ? "text-right" : "text-left",
              value === option
                ? "border-primary bg-primary/10"
                : "hover:bg-muted/50",
            )}
          >
            <span className="block font-medium">{t(props.labels[option])}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FormRadioCards<T extends string>(props: {
  name: FormFieldName;
  title: string;
  options: readonly T[];
  labels: Record<T, string>;
}) {
  const t = useTranslations();
  const isRtl = useLocale().startsWith("ar");
  const form = useFormContext<AnxietyScreeningInput>();
  const value = useWatch({
    control: form.control,
    name: props.name as never,
  }) as T;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{props.title}</h3>

      <RadioGroup
        dir={isRtl ? "rtl" : "ltr"}
        value={value ?? ""}
        onValueChange={(nextValue) =>
          form.setValue(props.name as never, nextValue as never, {
            shouldDirty: true,
          })
        }
        className="grid gap-3"
      >
        {props.options.map((option) => {
          const id = `${String(props.name)}-${option}`;
          const selected = value === option;

          return (
            <Label
              key={option}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-sm transition-colors",
                selected ? "border-primary bg-primary/10" : "hover:bg-muted/50",
              )}
            >
              <RadioGroupItem id={id} value={option} className="mt-0.5" />
              <span className="leading-6">
                {t(props.labels[option] as never)}
              </span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export function FormCheckboxGrid<T extends string>(props: {
  prefix: "panic.symptomsAtWorstPoint";
  options: readonly T[];
  labels: Record<T, string>;
}) {
  const t = useTranslations();
  const { setValue, control } = useFormContext<AnxietyScreeningInput>();
  const values = useWatch({ control, name: props.prefix as never }) as Record<
    T,
    boolean
  >;

  return (
    <div className="grid gap-3">
      {props.options.map((option) => {
        const checked = values?.[option] ?? false;
        const inputId = `${props.prefix}.${option}`;

        return (
          <Label
            key={option}
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-sm transition-colors",
              checked ? "border-primary bg-primary/10" : "hover:bg-muted/50",
            )}
          >
            <Checkbox
              id={inputId}
              checked={checked}
              onCheckedChange={(nextChecked) =>
                setValue(
                  `${props.prefix}.${option}` as never,
                  (nextChecked === true) as never,
                  {
                    shouldDirty: true,
                  },
                )
              }
            />
            <span className="leading-6">
              {t(props.labels[option] as never)}
            </span>
          </Label>
        );
      })}
    </div>
  );
}
