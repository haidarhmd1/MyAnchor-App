import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { allOptionSets, yesNoUnknownLabels } from "../helpers/questions";
import { YesNoUnknown } from "../helpers/schema";
import { FormBooleanCards, FormRadioCards } from "../helpers/FormUIHelpers";
import { useTranslations } from "next-intl";

export const RuleoutsStep = () => {
  const t = useTranslations("anxietyScreening");

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("contextStep.title")}</CardTitle>
        <CardDescription>{t("contextStep.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormRadioCards<YesNoUnknown>
          name="ruleOutFlags.symptomsOnlyDuringSubstanceUse"
          title={t("contextStep.questions.symptomsOnlyDuringSubstanceUse")}
          options={allOptionSets.yesNoUnknownOptions}
          labels={yesNoUnknownLabels}
        />
        <FormRadioCards<YesNoUnknown>
          name="ruleOutFlags.symptomsBetterExplainedByMedicalProblem"
          title={t(
            "contextStep.questions.symptomsBetterExplainedByMedicalProblem",
          )}
          options={allOptionSets.yesNoUnknownOptions}
          labels={yesNoUnknownLabels}
        />
        <FormRadioCards<YesNoUnknown>
          name="ruleOutFlags.recentTraumaCueDominant"
          title={t("contextStep.questions.recentTraumaCueDominant")}
          options={allOptionSets.yesNoUnknownOptions}
          labels={yesNoUnknownLabels}
        />
        <FormRadioCards<YesNoUnknown>
          name="ruleOutFlags.recentManiaLikeState"
          title={t("contextStep.questions.recentManiaLikeState")}
          options={allOptionSets.yesNoUnknownOptions}
          labels={yesNoUnknownLabels}
        />
        <FormBooleanCards
          name="safety.currentlyFeelsUnsafe"
          title={t("contextStep.questions.currentlyFeelsUnsafe")}
        />
      </CardContent>
    </Card>
  );
};
