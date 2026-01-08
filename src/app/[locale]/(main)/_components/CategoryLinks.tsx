import { categories } from "@/common/const/links";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { twMerge } from "tailwind-merge";

export const CategoryLinks = async () => {
  const t = await getTranslations();
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="">
        <h4 className="text-md font-bold">{t("home.journey.title")}</h4>
        <p className="text-xs font-thin">{t("home.journey.description")}</p>
      </div>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={c.link}
          style={{
            display: "contents",
          }}
        >
          <Card
            className={twMerge(
              clsx(
                "flex",
                [
                  "relative",
                  "rounded-3xl border-none",
                  "bg-linear-to-br",
                  "pt-4",
                  "shadow-md",
                  "transform transition will-change-transform",
                  "active:scale-[0.98]",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40",
                  c.gradient.from,
                  c.gradient.to,
                ].join(" "),
              ),
            )}
          >
            <CardContent className="flex px-4">
              <div>
                <h3 className={`text-md truncate font-medium`}>
                  {t(c.titleKey)}
                </h3>
                <p className="mt-0.5 text-xs font-thin">
                  {t(c.descriptionKey)}
                </p>
              </div>
              {/* <div
                className={`ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 shadow-inner backdrop-blur-[2px]`}
                aria-hidden
              >
                <div className="text-white drop-shadow">
                  <ArrowRight size={18} strokeWidth={1.25} />
                </div>
              </div> */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
