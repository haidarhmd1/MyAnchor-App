import { categories } from "@/common/const/links";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const toneClasses: Record<(typeof categories)[number]["tone"], string> = {
  primary: "from-primary/15 to-accent/10",
  secondary: "from-secondary to-muted",
  accent: "from-accent/75 to-secondary/60",
};
export const CategoryLinks = async () => {
  const isRtl = (await getLocale()).startsWith("ar");
  const t = await getTranslations();

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          {t("home.journey.title")}
        </h4>
        <p className="text-muted-foreground text-sm leading-6">
          {t("home.journey.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.map((c) => (
          <Link key={c.id} href={c.link} className="block">
            <Card
              className={cn(
                "border-border/60 relative h-28 overflow-hidden rounded-3xl border bg-linear-to-br pt-4 shadow-sm",
                "transition will-change-transform active:scale-[0.98]",
                "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
                toneClasses[c.tone],
              )}
            >
              <CardContent className="flex h-full items-start px-4 py-0">
                <div className="min-w-0">
                  <h3 className="text-foreground text-base font-semibold">
                    {t(c.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-5">
                    {t(c.descriptionKey)}
                  </p>
                </div>

                <div
                  className={cn(
                    "border-border/50 bg-card/70 text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-sm",
                    isRtl ? "mr-auto" : "ml-auto",
                  )}
                  aria-hidden
                >
                  {isRtl ? (
                    <ArrowLeft size={18} strokeWidth={1.6} />
                  ) : (
                    <ArrowRight size={18} strokeWidth={1.6} />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
