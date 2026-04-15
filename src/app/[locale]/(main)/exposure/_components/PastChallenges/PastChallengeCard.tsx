"use client";

import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { deleteChallengeEntry } from "@/lib/api";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export const PastChallengeCard = ({
  id,
  cardContentHeader,
  label,
  description,
  engagementLabel,
  engagementTitle,
  engagementDescription,
}: {
  id: string;
  cardContentHeader: string;
  label: string;
  description: string | null;
  engagementLabel: string;
  engagementTitle: string;
  engagementDescription: string;
}) => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <Card className="border-border bg-accent/70 shadow-sm transition-all hover:-translate-y-px hover:shadow-md active:scale-[0.98]">
      <CardFooter className="ml-auto">
        <DeleteActionButton
          triggerLabel={<Trash2Icon />}
          title={t("common.destructiveAction.title")}
          description={t("common.destructiveAction.description")}
          confirmLabel={t("common.destructiveAction.confirm")}
          cancelLabel={t("common.destructiveAction.cancel")}
          onConfirm={async () => {
            await deleteChallengeEntry(id);
            router.refresh();
          }}
          loadingLabel={t("common.destructiveAction.loading")}
          errorMessage={t("common.destructiveAction.error")}
        />
      </CardFooter>
      <CardContent className="flex flex-col gap-4 p-4">
        <div>
          <p className="text-muted-foreground text-xs font-medium">
            {cardContentHeader}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {t(label)}
          </p>

          {description ? (
            <p className="text-foreground text-sm leading-6">
              {t(description)}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {t(engagementLabel)}
          </p>

          <p className="text-foreground text-sm font-medium">
            {t(engagementTitle)}
          </p>

          <p className="text-muted-foreground text-sm leading-6">
            {t(engagementDescription)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
