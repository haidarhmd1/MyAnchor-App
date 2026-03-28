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
        className="bg-muted relative h-60 w-full overflow-hidden rounded-b-4xl"
        style={{
          backgroundImage: `url("${matchedSlug.imgSrc}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <div className="inset-x-0 bottom-0 p-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium tracking-[0.16em] text-white/80 uppercase">
              {t(matchedSlug.titleKey)}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {t(matchedSlug.descriptionKey)}
            </h1>
          </div>
        </div>
        {matchedSlug.content.map((content) => (
          <p
            key={content.id}
            className="text-muted-foreground text-base leading-7"
          >
            {t(content.textKey)}
          </p>
        ))}
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
