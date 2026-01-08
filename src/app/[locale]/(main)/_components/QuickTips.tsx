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
    <div className="space-y-4">
      <div className="">
        <h4 className="text-md font-bold">{t("tip")}</h4>
        <p className="text-xs font-thin"></p>
      </div>
      <Carousel>
        <CarouselContent>
          {tips.map((c) => {
            return (
              <CarouselItem key={c.id} className="basis-1/2">
                <Link
                  href={`tip/${c.slug}`}
                  style={{
                    display: "contents",
                  }}
                >
                  <div
                    className="h-[136px] w-full rounded-md"
                    style={{
                      backgroundImage: `url("${c.imgSrc}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="mt-4">
                    <h3>{t2(c.titleKey)}</h3>
                    <p className="sub line-clamp-2 overflow-hidden text-ellipsis">
                      {t2(c.descriptionKey)}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
