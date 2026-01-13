import { CardContainer } from "@/components/Card/Card";
import { education } from "@/common/const/links";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export default async function EducationPage() {
  const t = await getTranslations();

  return (
    <>
      <div
        className="h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url("/illustration/psycho-education.png")`,
          backgroundPosition: "center",
        }}
      />
      <div className="p-4">
        <div>
          <h5 className="font-light">{t("educationPage.hero.eyebrow")}</h5>
          <h2>{t("educationPage.hero.title")}</h2>
          <p className="mt-2">{t("educationPage.hero.subtitle")}</p>
        </div>
        <div className="mt-6">
          {education.map((e) => (
            <CardContainer
              key={e.id}
              className="mb-4 animate-[fadeUp_.35s_ease-out_both] shadow-md will-change-transform motion-reduce:animate-none"
              title={t(e.titleKey)}
              description={t(e.descriptionKey)}
              icon={
                <div
                  className="mr-2 h-16 w-16 rounded-md"
                  style={{
                    backgroundImage: `url(${e.imgSrc})`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                />
              }
              link={e.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Psychoeducation",
};
