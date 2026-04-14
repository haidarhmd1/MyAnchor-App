"use client";

import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { CardHeader } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { deleteAnxietyProfileEntry } from "@/lib/api";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export const AnxietyProfileCardHeader = ({ id }: { id: string }) => {
  const t = useTranslations();
  const router = useRouter();
  return (
    <CardHeader className="flex justify-between">
      <p className="text-md font-bold">{t("common.insightsOverview")}</p>
      <DeleteActionButton
        triggerLabel={<Trash2Icon />}
        title={t("common.destructiveAction.title")}
        description={t("common.destructiveAction.description")}
        confirmLabel={t("common.destructiveAction.confirm")}
        cancelLabel={t("common.destructiveAction.cancel")}
        onConfirm={async () => {
          await deleteAnxietyProfileEntry(id);
          router.refresh();
        }}
        loadingLabel={t("common.destructiveAction.loading")}
        errorMessage={t("common.destructiveAction.error")}
      />
    </CardHeader>
  );
};
