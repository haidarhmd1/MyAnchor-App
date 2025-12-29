import { exercisesInteroceptiveContent } from "@/common/const/content";
import { Information } from "./_components/Information";
import { Exercises } from "./_components/Exercises";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarningIcon } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();

  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(/illustration/exercises.png)`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">
          {t(exercisesInteroceptiveContent.titleKey)}
        </h5>
        <h2>{t(exercisesInteroceptiveContent.subtitleKey)}</h2>

        <Alert
          variant="default"
          className="border-muted my-4 rounded-4xl bg-amber-50 shadow-none"
        >
          <MessageCircleWarningIcon />
          <AlertTitle>{t("common.tip")}</AlertTitle>
          <AlertDescription>{t("exercisesPage.reminder")}</AlertDescription>
        </Alert>
        <div className="mb-4">
          {exercisesInteroceptiveContent.content.map((content) => (
            <p key={content.id} className="mt-4">
              {t(content.textKey)}
            </p>
          ))}
        </div>
        <Exercises />
        <>
          <Information />
        </>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exercises",
};
