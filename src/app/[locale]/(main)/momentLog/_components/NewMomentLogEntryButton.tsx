"use client";

import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import MomentLogForm from "./MomentLogForm";
import { cn } from "@/lib/utils";

export const NewMomentLogEntryButton = () => {
  const isRtl = useLocale().startsWith("ar");
  const t = useTranslations("momentLog.newEntry");
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "bg-card border-border mt-4 flex w-full items-center rounded-4xl border border-dashed p-12 shadow-sm transition",
          isRtl ? "text-right" : "text-left",
          "hover:bg-muted/40 active:scale-[0.98]",
          "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
        )}
        aria-label={t("ariaOpen")}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h3 className="text-foreground truncate text-base font-medium">
            {t("title")}
          </h3>

          <div
            className={cn(
              "bg-accent text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              isRtl ? "mr-auto" : "ml-auto",
            )}
            aria-hidden
          >
            <Plus className="h-4 w-4" strokeWidth={2.25} />
          </div>
        </div>
      </button>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container className="bg-background! text-foreground!">
          <Sheet.Header className="bg-background!" />
          <Sheet.Content className="bg-background! p-4">
            <MomentLogForm callback={() => setOpen(false)} />
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop className="bg-foreground/20! backdrop-blur-sm!" />
      </Sheet>
    </>
  );
};
