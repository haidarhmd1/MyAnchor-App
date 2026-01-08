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

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // changes whenever dialog opens or server value changes -> remount form -> defaultValues re-applied
  const formKey = useMemo(() => {
    return `${open ? "open" : "closed"}-${name ?? ""}`;
  }, [open, name]);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
          <SettingsRowInput label={t("name.label")} value={label ?? name} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("name.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <NameFormInner
          key={formKey}
          initialName={name}
          t={t}
          isPending={isPending}
          onSaved={() => {
            setIsOpen(false);
            startTransition(() => router.refresh());
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

function NameFormInner({
  initialName,
  t,
  isPending,
  onSaved,
}: {
  initialName: string;
  t: ReturnType<typeof useTranslations>;
  isPending: boolean;
  onSaved: () => void;
}) {
  const form = useForm<FormValues>({
    defaultValues: { name: initialName },
  });

  const handleSave = async (data: FormValues) => {
    try {
      const name = data.name?.trim();
      if (!name) return;

      await updateUserProfile({
        data: { name },
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
      <Input {...form.register("name")} autoFocus />

      <DialogFooter className="grid grid-cols-2">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            {t("actions.cancel")}
          </Button>
        </DialogClose>

        <Button
          type="submit"
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
