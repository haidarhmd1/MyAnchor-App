import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const NewMomentLogEntryButton = async () => {
  const locale = await getLocale();
  const isRtl = locale.startsWith("ar");
  const t = await getTranslations("momentLog.newEntry");

  return (
    <Link
      href="momentLog/new"
      className={cn(
        "bg-card border-border mt-4 flex w-full items-center rounded-3xl border border-dashed p-6 shadow-sm transition",
        isRtl ? "text-right" : "text-left",
        "hover:bg-muted/40 active:scale-[0.98]",
        "focus-visible:ring-ring/70 focus:outline-none focus-visible:ring-2",
      )}
      aria-label={t("ariaOpen")}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h3 className="text-foreground text-base font-medium">{t("title")}</h3>

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
    </Link>
  );
};
