import { useFormContext, useWatch } from "react-hook-form";
import {
  AnxietyScreeningInput,
  panicSymptomIds,
  YesNoUnknown,
} from "../helpers/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  allOptionSets,
  panicFrequencyLabels,
  yesNoUnknownLabels,
  panicSymptomLabels,
} from "../helpers/questions";
import {
  FormBooleanCards,
  FormRadioCards,
  FormCheckboxGrid,
} from "../helpers/FormUIHelpers";
import { useTranslations } from "next-intl";

export const PanicStep = () => {
  const t = useTranslations("anxietyScreening");
  const { control } = useFormContext<AnxietyScreeningInput>();
  const hadSurges = useWatch({
    control,
    name: "panic.hadSuddenFearSurgesLastMonth",
  });

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("panicStep.title")}</CardTitle>
        <CardDescription>{t("panicStep.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormBooleanCards
          name="panic.hadSuddenFearSurgesLastMonth"
          title={t("panicStep.questions.hadSurges")}
        />

        {hadSurges ? (
          <div className="space-y-6">
            <FormBooleanCards
              name="panic.surgesPeakWithinMinutes"
              title={t("panicStep.questions.peakWithinMinutes")}
            />

            <FormRadioCards<
              "none" | "one" | "twoToThree" | "fourOrMore" | "notSure"
            >
              name="panic.attackFrequencyLastMonth"
              title={t("panicStep.questions.frequency")}
              options={allOptionSets.panicAttackFrequencyOptions}
              labels={panicFrequencyLabels}
            />

            <FormRadioCards<YesNoUnknown>
              name="panic.attacksSeemedUnexpected"
              title={t("panicStep.questions.unexpected")}
              options={allOptionSets.yesNoUnknownOptions}
              labels={yesNoUnknownLabels}
            />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                {t("panicStep.questions.symptomsTitle")}
              </h3>
              <FormCheckboxGrid
                prefix="panic.symptomsAtWorstPoint"
                options={panicSymptomIds}
                labels={panicSymptomLabels}
              />
            </div>

            <FormRadioCards<YesNoUnknown>
              name="panic.persistentConcernMoreThanOneMonth"
              title={t("panicStep.questions.persistentConcern")}
              options={allOptionSets.yesNoUnknownOptions}
              labels={yesNoUnknownLabels}
            />

            <FormRadioCards<YesNoUnknown>
              name="panic.maladaptiveBehaviorChangeMoreThanOneMonth"
              title={t("panicStep.questions.behaviorChange")}
              options={allOptionSets.yesNoUnknownOptions}
              labels={yesNoUnknownLabels}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
