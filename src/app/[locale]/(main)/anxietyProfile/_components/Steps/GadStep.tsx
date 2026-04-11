import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  allOptionSets,
  gadDurationLabels,
  gad7QuestionLikertLabels,
  likertLabels,
} from "../helpers/questions";
import { FormLikertCards, FormRadioCards } from "../helpers/FormUIHelpers";
import { FormFieldName } from "../../AnxietyScreeningForm";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export const GadStep = () => {
  const t = useTranslations("anxietyScreening");
  return (
    <>
      <Card className="border-border/60 rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("gadStep.title")}</CardTitle>
          <CardDescription>{t("gadStep.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormRadioCards<"lessThan6Months" | "sixMonthsOrMore" | "notSure">
            name="gadDuration"
            title={t("gadStep.gad7ItemQuestions.duration")}
            options={allOptionSets.gadDurationOptions}
            labels={gadDurationLabels}
          />

          <Separator />

          <div className="space-y-5">
            {(
              Object.keys(gad7QuestionLikertLabels) as Array<
                keyof typeof gad7QuestionLikertLabels
              >
            ).map((key) => (
              <FormLikertCards
                key={key}
                name={`gad7.${key}` as FormFieldName}
                title={t(gad7QuestionLikertLabels[key])}
                labels={likertLabels}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
