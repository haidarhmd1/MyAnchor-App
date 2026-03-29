"use client";

import { Ear, Eye, Hand, IceCream, Smile } from "lucide-react";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const Grounding = () => {
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");
  const t = useTranslations("panicEmergency.grounding");
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="surface-soft h-28 min-h-24 w-full rounded-2xl p-3 text-left shadow-sm transition will-change-transform active:scale-[0.98]"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col text-left">
          <h4
            className={cn(
              "text-foreground text-sm font-medium",
              isRtl ? "text-right" : "text-left",
            )}
          >
            {t("card.title")}
          </h4>
          <p
            className={cn(
              "text-muted-foreground text-xs font-light",
              isRtl ? "text-right" : "text-left",
            )}
          >
            {t("card.subtitle")}
          </p>
        </div>
      </button>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container className="bg-background! text-foreground!">
          <Sheet.Header />
          <Sheet.Content className="p-4">
            <div className="space-y-8 pb-6">
              <div className="text-muted-foreground text-sm leading-6">
                {t("sheet.intro")}
              </div>

              <div className="space-y-5">
                <GroundingStep
                  icon={<Eye className="h-5 w-5" />}
                  title={t("steps.see.title")}
                  subtitle={t("steps.see.subtitle")}
                />

                <GroundingStep
                  icon={<Hand className="h-5 w-5" />}
                  title={t("steps.touch.title")}
                  subtitle={t("steps.touch.subtitle")}
                />

                <GroundingStep
                  icon={<Ear className="h-5 w-5" />}
                  title={t("steps.hear.title")}
                  subtitle={t("steps.hear.subtitle")}
                />

                <GroundingStep
                  icon={<Smile className="h-5 w-5" />}
                  title={t("steps.smell.title")}
                  subtitle={t("steps.smell.subtitle")}
                />

                <GroundingStep
                  icon={<IceCream className="h-5 w-5" />}
                  title={t("steps.taste.title")}
                  subtitle={t("steps.taste.subtitle")}
                />
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop className="!bg-foreground/20 !backdrop-blur-sm" />
      </Sheet>
    </div>
  );
};

function GroundingStep({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="surface-soft flex items-start gap-4 rounded-2xl p-4 shadow-sm">
      <div className="bg-accent text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
        {icon}
      </div>

      <div className="flex flex-col text-left">
        <h4 className="text-foreground text-sm font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm leading-6 font-light">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
