"use client";

import { useRouter } from "next/navigation";
import { SettingsRowInput } from "../../General/SettingsRowInput";
import { useMemo, useState, useTransition } from "react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

type FormValues = { name: string };

export const Name = ({ label, name }: { label?: string; name: string }) => {
  const t = useTranslations("form");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formKey = useMemo(() => {
    return `${open ? "open" : "closed"}-${name ?? ""}`;
  }, [open, name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring/70 w-full rounded-2xl text-left transition focus:outline-none focus-visible:ring-2"
        >
          <SettingsRowInput label={t("name.label")} value={label ?? name} />
        </button>
      </DialogTrigger>

      <DialogContent className="border-border bg-card text-card-foreground rounded-3xl border shadow-lg">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-foreground text-lg font-semibold tracking-tight">
            {t("name.dialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <NameFormInner
          key={formKey}
          initialName={name}
          isPending={isPending}
          onSaved={() => {
            setOpen(false);
            startTransition(() => router.refresh());
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

function NameFormInner({
  initialName,
  isPending,
  onSaved,
}: {
  initialName: string;
  isPending: boolean;
  onSaved: () => void;
}) {
  const t = useTranslations("form");

  const form = useForm<FormValues>({
    defaultValues: { name: initialName },
  });

  const handleSave = async (data: FormValues) => {
    try {
      const trimmedName = data.name?.trim();

      if (!trimmedName) {
        return;
      }

      await updateUserProfile({
        data: { name: trimmedName },
      });

      toast.success(t("name.toast.success"));
      onSaved();
    } catch (error) {
      toast.error(t("name.toast.error"));
      console.error(error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
      <Input
        {...form.register("name")}
        autoFocus
        className="bg-background text-foreground border-border"
      />

      <DialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <DialogClose asChild>
          <Button variant="outline" type="button" className="w-full">
            {t("actions.cancel")}
          </Button>
        </DialogClose>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground w-full hover:opacity-95"
          disabled={form.formState.isSubmitting || isPending}
        >
          {form.formState.isSubmitting || isPending
            ? t("actions.saving")
            : t("actions.saveChanges")}
        </Button>
      </DialogFooter>
    </form>
  );
}
