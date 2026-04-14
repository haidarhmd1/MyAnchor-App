import { CardContainer } from "@/components/Card/Card";
import { education } from "@/common/const/links";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export default async function EducationPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  const isRtl = locale.startsWith("ar");

  return (
    <section className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: 'url("/illustration/psycho-education.png")',
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="space-y-6 px-4 py-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t("educationPage.hero.eyebrow")}
          </p>

          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            {t("educationPage.hero.title")}
          </h2>

          <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
            {t("educationPage.hero.subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {education.map((item) => (
            <CardContainer
              key={item.id}
              className="animate-[fadeUp_.35s_ease-out_both] border-none shadow-sm will-change-transform active:scale-[0.98] motion-reduce:animate-none"
              title={t(item.titleKey)}
              description={t(item.descriptionKey)}
              icon={
                <div
                  className={cn(
                    "bg-card h-16 w-16 shrink-0 rounded-2xl",
                    isRtl ? "ml-2" : "mr-2",
                  )}
                  style={{
                    backgroundImage: `url(${item.imgSrc})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                />
              }
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Psychoeducation",
};
