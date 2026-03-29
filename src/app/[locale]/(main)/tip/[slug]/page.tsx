import { tips } from "@/common/const/tips";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Tip({ params }: Props) {
  const t = await getTranslations();
  const { slug } = await params;

  const matchedSlug = tips.find((tip) => tip.slug === slug);

  if (!matchedSlug) {
    notFound();
  }

  return (
    <article className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(${matchedSlug.imgSrc})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-4">
        <header className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t(matchedSlug.titleKey)}
          </p>

          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {t(matchedSlug.descriptionKey)}
          </h1>
        </header>

        <section className="space-y-4">
          {matchedSlug.content.map((content) => (
            <p
              key={content.id}
              className="text-muted-foreground text-base leading-7"
            >
              {t(content.textKey)}
            </p>
          ))}
        </section>
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();
  const { slug } = await params;

  const matchedSlug = tips.find((tip) => tip.slug === slug);

  if (!matchedSlug) {
    notFound();
  }

  return {
    title: `⚓ MyAnchor - Tips - ${t(matchedSlug.titleKey)}`,
  };
}
