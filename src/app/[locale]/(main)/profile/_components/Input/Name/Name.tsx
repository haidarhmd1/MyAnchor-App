"use client";

import { useRouter } from "next/navigation";
import { SettingsRowInput } from "../../General/SettingsRowInput";
import { useState, useTransition } from "react";
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

export const Name = ({ name }: { name: string }) => {
  const t = useTranslations("name");
  const router = useRouter();

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm({
    defaultValues: { name },
  });

  const handleSave = async (data: { name: string }) => {
    try {
      await updateUserProfile({
        data: { name: data.name },
      });

      toast.success(t("toast.success"));
      setIsOpen(false);

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error(t("toast.error"));
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => setIsOpen(o)}>
      <DialogTrigger>
        <SettingsRowInput label={t("label")} value={name} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
          <Input {...register("name")} />

          <DialogFooter className="grid grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline">{t("actions.cancel")}</Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? t("actions.saving") : t("actions.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
