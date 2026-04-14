import { education } from "@/common/const/links";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const t = await getTranslations();
  const { slug } = await params;

  const entry = education.find((e) => e.slug === slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="bg-background text-foreground pb-8">
      <div
        className="bg-muted h-60 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(${entry.imgSrc})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-4">
        <header className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.16em] uppercase">
            {t(entry.content.titleKey)}
          </p>

          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {t(entry.content.subtitleKey)}
          </h1>
        </header>

        <section className="space-y-4">
          {entry.content.content.map((block) => {
            switch (block.type) {
              case "intro":
                return (
                  <div key={block.id} className="bg-accent rounded-3xl p-4">
                    <p className="text-muted-foreground text-sm leading-6">
                      {t(block.textKey)}
                    </p>
                  </div>
                );

              case "text":
                return (
                  <section key={block.id} className="space-y-2">
                    {block.titleKey ? (
                      <h2 className="text-foreground text-base font-semibold">
                        {t(block.titleKey)}
                      </h2>
                    ) : null}
                    <p className="text-muted-foreground text-base leading-7">
                      {t(block.textKey)}
                    </p>
                  </section>
                );

              case "highlight":
                return (
                  <section
                    key={block.id}
                    className="bg-card rounded-3xl p-4 shadow-sm"
                  >
                    <h2 className="text-foreground text-base font-semibold">
                      {t(block.titleKey)}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {t(block.textKey)}
                    </p>
                  </section>
                );

              case "list":
                return (
                  <section key={block.id} className="space-y-2">
                    {block.titleKey ? (
                      <h2 className="text-foreground text-base font-semibold">
                        {t(block.titleKey)}
                      </h2>
                    ) : null}
                    <ul className="space-y-2 ps-5">
                      {block.items.map((item) => (
                        <li
                          key={item.id}
                          className="text-muted-foreground list-disc text-sm leading-6"
                        >
                          {t(item.textKey)}
                        </li>
                      ))}
                    </ul>
                  </section>
                );

              case "steps":
                return (
                  <section
                    key={block.id}
                    className="bg-secondary rounded-3xl p-4 shadow-sm"
                  >
                    <h2 className="text-foreground text-base font-semibold">
                      {t(block.titleKey)}
                    </h2>
                    <ol className="mt-3 space-y-2 ps-5">
                      {block.items.map((item) => (
                        <li
                          key={item.id}
                          className="text-muted-foreground list-decimal text-sm leading-6"
                        >
                          {t(item.textKey)}
                        </li>
                      ))}
                    </ol>
                  </section>
                );

              case "affirmation":
                return (
                  <div
                    key={block.id}
                    className="bg-accent rounded-3xl p-4 shadow-sm"
                  >
                    <p className="text-foreground text-sm leading-6">
                      {t(block.textKey)}
                    </p>
                  </div>
                );

              case "warning":
                return (
                  <section
                    key={block.id}
                    className="bg-destructive/10 rounded-3xl p-4 shadow-sm"
                  >
                    <h2 className="text-foreground text-base font-semibold">
                      {t(block.titleKey)}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {t(block.textKey)}
                    </p>
                  </section>
                );

              default:
                return null;
            }
          })}
        </section>
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations();
  const { slug } = await params;

  const entry = education.find((e) => e.slug === slug);

  if (!entry) {
    notFound();
  }

  return {
    title: `⚓ MyAnchor - Education - ${t(entry.titleKey)}`,
  };
}
