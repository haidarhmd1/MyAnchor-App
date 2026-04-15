"use client";

import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteMomentLogEntry } from "@/lib/api";

export const MomentLogCard = ({
  id,
  subtitle,
}: {
  id: string;
  subtitle: string;
}) => {
  const t = useTranslations();
  const router = useRouter();
  return (
    <Card className="border-border bg-accent/60 animate-[fadeUp_.35s_ease-out_both] space-y-0 shadow-sm transition-all active:scale-[0.98] motion-reduce:animate-none">
      <div className="flex justify-end px-4">
        <DeleteActionButton
          triggerLabel={<Trash2Icon />}
          title={t("common.destructiveAction.title")}
          description={t("common.destructiveAction.description")}
          confirmLabel={t("common.destructiveAction.confirm")}
          cancelLabel={t("common.destructiveAction.cancel")}
          onConfirm={async () => {
            await deleteMomentLogEntry(id);
            router.refresh();
          }}
          loadingLabel={t("common.destructiveAction.loading")}
          errorMessage={t("common.destructiveAction.error")}
        />
      </div>
      <CardContent className="space-y-2">
        <h4 className="text-foreground text-sm font-semibold">
          {t("momentLog.entry.title")}
        </h4>

        <p className="text-muted-foreground text-xs font-medium">{subtitle}</p>
      </CardContent>
    </Card>
  );
};
