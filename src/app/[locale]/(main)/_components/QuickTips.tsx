import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { tips } from "@/common/const/tips";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export const QuickTips = async () => {
  const t = await getTranslations("common");
  const t2 = await getTranslations();

  return (
    <section className="space-y-4">
      <h4 className="text-foreground text-base font-semibold tracking-tight">
        {t("tip")}
      </h4>

      <Carousel>
        <CarouselContent className="-ml-1">
          {tips.map((c) => {
            return (
              <CarouselItem
                key={c.id}
                className="basis-[78%] pr-4 sm:basis-1/2"
              >
                <Link href={`tip/${c.slug}`} style={{ display: "contents" }}>
                  <article className="surface-soft h-full rounded-3xl p-4 shadow-sm transition will-change-transform active:scale-[0.98]">
                    <div
                      className="bg-muted h-36 w-full rounded-2xl"
                      style={{
                        backgroundImage: `url("${c.imgSrc}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="mt-4 space-y-1">
                      <h3 className="text-foreground line-clamp-2 text-sm font-semibold">
                        {t2(c.titleKey)}
                      </h3>

                      <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
                        {t2(c.descriptionKey)}
                      </p>
                    </div>
                  </article>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
