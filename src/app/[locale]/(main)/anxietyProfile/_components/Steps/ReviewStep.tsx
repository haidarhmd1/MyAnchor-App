import { useFormContext, useWatch } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useMemo } from "react";
import { deriveAnxietyProfile } from "../helpers/scoring";
import { PreviewTile } from "../helpers/FormUIHelpers";
import { useTranslations } from "next-intl";
import { AnxietyScreeningInput } from "../helpers/schema";
import { AnxietyScreeningRequestInput } from "../helpers/request.schema";

export const ReviewStep = () => {
  const t = useTranslations("anxietyScreening");
  const { control } = useFormContext<AnxietyScreeningInput>();
  const values = useWatch({ control });

  const preview = useMemo(() => {
    const profile = deriveAnxietyProfile(
      values as AnxietyScreeningRequestInput,
    );
    return profile;
  }, [values]);

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("previewStep.title")}</CardTitle>
        <CardDescription>{t("previewStep.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PreviewTile
          label={t("previewStep.tiles.likelyFocus")}
          value={t(
            `previewScoring.values.focus.${preview.cbtFormulation.focus}`,
          )}
        />

        <PreviewTile
          label={t("previewStep.tiles.gad7")}
          value={`${preview.screeners.gad7.total} (${t(
            `previewScoring.values.severityBand.${preview.screeners.gad7.severityBand}`,
          )})`}
        />

        <PreviewTile
          label={t("previewStep.tiles.maintainingLoop")}
          value={t(
            `previewScoring.values.dominantLoop.${preview.maintainingFactors.dominantLoop}`,
          )}
        />

        <PreviewTile
          label={t("previewStep.tiles.confidence")}
          value={t(
            `previewScoring.values.confidence.${preview.summary.confidence}`,
          )}
        />
      </CardContent>
    </Card>
  );
};
