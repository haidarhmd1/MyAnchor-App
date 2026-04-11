import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { useTranslations } from "next-intl";

export const IntroStep = () => {
  const t = useTranslations("anxietyScreening");
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
      </CardContent>
    </Card>
  );
};
