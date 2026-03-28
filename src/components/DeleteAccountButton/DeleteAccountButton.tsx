"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { toast } from "sonner";
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
} from "../ui/alertDialog";

export const DeleteAccountButton = () => {
  const t = useTranslations("deleteAccount");
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/account", { method: "DELETE" });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      await signOut({ callbackUrl: "/home" });
    } catch (err) {
      console.error(err);
      toast.error(t("error"));
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="w-full rounded-2xl"
        >
          {t("button")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-card text-card-foreground border-border rounded-3xl border shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-foreground text-lg font-semibold tracking-tight">
            {t("title")}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-muted-foreground text-sm leading-6">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <AlertDialogCancel disabled={loading} className="w-full rounded-2xl">
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full rounded-2xl disabled:opacity-60"
          >
            {loading ? t("loading") : t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
