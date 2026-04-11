import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { allOptionSets, impairmentLabels } from "../helpers/questions";
import { ImpairmentOption } from "../helpers/schema";
import { FormRadioCards } from "../helpers/FormUIHelpers";
import { useTranslations } from "next-intl";

export const ImpactStep = () => {
  const t = useTranslations("anxietyScreening");
  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("impairmentStep.title")}</CardTitle>
        <CardDescription>{t("impairmentStep.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormRadioCards<ImpairmentOption>
          name="impairment.home"
          title={t("impairmentStep.questions.home")}
          options={allOptionSets.impairmentOptions}
          labels={impairmentLabels}
        />
        <FormRadioCards<ImpairmentOption>
          name="impairment.workOrStudy"
          title={t("impairmentStep.questions.workOrStudy")}
          options={allOptionSets.impairmentOptions}
          labels={impairmentLabels}
        />
        <FormRadioCards<ImpairmentOption>
          name="impairment.social"
          title={t("impairmentStep.questions.social")}
          options={allOptionSets.impairmentOptions}
          labels={impairmentLabels}
        />
      </CardContent>
    </Card>
  );
};
