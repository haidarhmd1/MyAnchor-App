import type { Metadata } from "next";
import { TabSwitcher } from "./_components/TabSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("exposurePage");
  return { title: t("metaTitle") };
}

export default async function Page() {
  const t = await getTranslations("exposurePage");

  return (
    <article className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-[2rem]"
        style={{
          backgroundImage: 'url("/illustration/understanding-anxiety.png")',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="space-y-6 px-4 py-4">
        <header className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t("hero.eyebrow")}
          </p>

          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {t("hero.title")}
          </h1>

          <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
            {t("hero.description")}
          </p>
        </header>

        <Alert
          variant="default"
          className="border-border bg-accent text-accent-foreground rounded-[2rem] shadow-sm"
        >
          <Lightbulb className="text-primary h-4 w-4" />
          <AlertTitle className="text-foreground text-sm font-semibold">
            {t("alert.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground text-sm leading-6">
            {t("alert.description")}
          </AlertDescription>
        </Alert>

        <section className="pt-2">
          <TabSwitcher />
        </section>
      </div>
    </article>
  );
}
