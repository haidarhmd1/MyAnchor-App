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
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/understanding-anxiety.png")`,
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />
      <div className="p-4">
        <h5 className="font-light">{t("hero.eyebrow")}</h5>
        <h2>{t("hero.title")}</h2>

        <div className="mb-4">
          <p className="mt-4">{t("hero.description")}</p>
        </div>

        <Alert variant="default" className="mb-4 rounded-4xl">
          <Lightbulb />
          <AlertTitle>{t("alert.title")}</AlertTitle>
          <AlertDescription>{t("alert.description")}</AlertDescription>
        </Alert>

        <div className="py-8">
          <TabSwitcher />
        </div>
      </div>
    </>
  );
}
