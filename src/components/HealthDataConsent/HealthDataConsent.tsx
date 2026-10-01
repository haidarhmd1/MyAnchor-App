"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog";

export function HealthDataConsent({ active }: { active: boolean }) {
  const t = useTranslations("healthDataConsent");
  const [hasConsent, setHasConsent] = useState(active);
  const [loading, setLoading] = useState(false);

  async function withdraw() {
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch("/api/consent/health-data", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("consent_withdraw_failed");

      setHasConsent(false);
      toast.success(t("success"));
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-foreground text-sm font-medium">{t("title")}</p>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {hasConsent ? t("active") : t("inactive")}
        </p>
      </div>

      {hasConsent && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              {t("button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction disabled={loading} onClick={withdraw}>
                {loading ? t("loading") : t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
