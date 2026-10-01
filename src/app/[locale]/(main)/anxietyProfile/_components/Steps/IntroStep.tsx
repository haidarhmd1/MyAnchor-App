import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { AnxietyScreeningInput } from "../helpers/schema";

export const IntroStep = () => {
  const t = useTranslations("anxietyScreening");
  const form = useFormContext<AnxietyScreeningInput>();

  const acknowledgements = [
    {
      name: "acknowledgements.understandsScreeningOnly" as const,
      label: t("intro.acknowledgements.screening"),
    },
    {
      name: "acknowledgements.understandsEmergencyLimits" as const,
      label: t("intro.acknowledgements.emergency"),
    },
    {
      name: "acknowledgements.consentsToHealthDataProcessing" as const,
      label: t("intro.acknowledgements.privacy"),
    },
  ];

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
          <HeartHandshake className="h-5 w-5" />
        </div>

        <CardTitle className="text-2xl">{t("intro.title")}</CardTitle>

        <CardDescription>{t("intro.description")}</CardDescription>
      </CardHeader>

      <CardContent className="text-foreground/90 space-y-4 text-sm leading-6">
        <div className="rounded-2xl border p-4">
          {t("intro.points.honestAnswers")}
        </div>

        <div className="rounded-2xl border p-4">{t("intro.points.safety")}</div>

        <div className="rounded-2xl border p-4">{t("intro.points.result")}</div>

        <div className="space-y-3 rounded-2xl border p-4">
          {acknowledgements.map(({ name, label }) => {
            const id = name.replaceAll(".", "-");
            return (
              <div key={name} className="flex items-start gap-3">
                <Checkbox
                  id={id}
                  checked={form.watch(name)}
                  onCheckedChange={(checked) =>
                    form.setValue(name, checked === true, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <label htmlFor={id} className="cursor-pointer leading-5">
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
