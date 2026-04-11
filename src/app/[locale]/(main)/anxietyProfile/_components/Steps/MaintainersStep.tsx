import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  worryMaintainerLabels,
  likertLabels,
  panicMaintainerLabels,
} from "../helpers/questions";
import { worryMaintainerIds, panicMaintainerIds } from "../helpers/schema";
import { FormLikertCards } from "../helpers/FormUIHelpers";
import { useTranslations } from "next-intl";

export const MaintainersStep = () => {
  const t = useTranslations();
  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {t("anxietyScreening.maintainerStep.title")}
        </CardTitle>
        <CardDescription>
          {t("anxietyScreening.maintainerStep.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              {t("anxietyScreening.maintainerStep.worryLoop.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("anxietyScreening.maintainerStep.worryLoop.description")}
            </p>
          </div>
          {worryMaintainerIds.map((id) => (
            <FormLikertCards
              key={id}
              name={`maintainingFactors.worry.${id}` as const}
              title={t(worryMaintainerLabels[id])}
              labels={likertLabels}
            />
          ))}
        </div>

        <Separator />

        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">
              {t("anxietyScreening.maintainerStep.panicLoop.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("anxietyScreening.maintainerStep.panicLoop.description")}
            </p>
          </div>
          {panicMaintainerIds.map((id) => (
            <FormLikertCards
              key={id}
              name={`maintainingFactors.panic.${id}` as const}
              title={t(panicMaintainerLabels[id])}
              labels={likertLabels}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
