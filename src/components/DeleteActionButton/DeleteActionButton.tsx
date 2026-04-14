"use client";

import { useState } from "react";
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

type DeleteActionButtonProps = {
  triggerLabel: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loadingLabel?: string;
  onConfirm: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  disabled?: boolean;
};

export function DeleteActionButton({
  triggerLabel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loadingLabel = "Loading...",
  onConfirm,
  successMessage,
  errorMessage = "Something went wrong",
  onSuccess,
  disabled,
}: DeleteActionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await onConfirm();

      if (successMessage) {
        toast.success(successMessage);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Destructive action failed:", error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          className="rounded-2xl"
          disabled={disabled}
        >
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-card text-card-foreground border-border rounded-3xl border shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-foreground text-lg font-semibold tracking-tight">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-muted-foreground text-sm leading-6">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <AlertDialogCancel disabled={loading} className="w-full rounded-2xl">
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full rounded-2xl disabled:opacity-60"
          >
            {loading ? loadingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
