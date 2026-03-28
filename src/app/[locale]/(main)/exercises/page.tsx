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
    <article className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: "url(/illustration/exercises.png)",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="space-y-6 px-4 py-4">
        <header className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t(exercisesInteroceptiveContent.titleKey)}
          </p>

          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {t(exercisesInteroceptiveContent.subtitleKey)}
          </h1>
        </header>

        <Alert
          variant="default"
          className="border-border bg-accent text-accent-foreground animate-[fadeUp_.35s_ease-out_both] rounded-[2rem] shadow-sm will-change-transform motion-reduce:animate-none"
        >
          <MessageCircleWarningIcon className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">
            {t("common.tip")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm leading-6">
            {t("exercisesPage.reminder")}
          </AlertDescription>
        </Alert>

        {/* <section className="space-y-4">
          {exercisesInteroceptiveContent.content.map((content) => (
            <p
              key={content.id}
              className="text-muted-foreground animate-[fadeUp_.35s_ease-out_both] text-base leading-7 will-change-transform motion-reduce:animate-none"
            >
              {t(content.)}
            </p>
          ))}
        </section> */}

        <Information />
        <Exercises />
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Exercises",
};
