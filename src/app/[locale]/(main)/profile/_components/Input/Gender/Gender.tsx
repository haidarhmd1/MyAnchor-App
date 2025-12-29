"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsRowInput } from "../../General/SettingsRowInput";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender } from "@prisma/client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const genderKey = (gender: Gender | string) => {
  switch (gender) {
    case Gender.FEMALE:
      return "options.female";
    case Gender.MALE:
      return "options.male";
    case Gender.OTHER:
      return "options.other";
    default:
      return "notSet";
  }
};

export const GenderPicker = ({ gender }: { gender: string }) => {
  const t = useTranslations("gender");
  const router = useRouter();

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: { gender },
  });

  const handleSave = async (data: { gender: Gender | string }) => {
    try {
      await updateUserProfile({
        data: {
          gender: data.gender as Gender,
        },
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
        <SettingsRowInput label={t("label")} value={t(genderKey(gender))} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("placeholder")} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={Gender.MALE}>
                        {t("options.male")}
                      </SelectItem>
                      <SelectItem value={Gender.FEMALE}>
                        {t("options.female")}
                      </SelectItem>
                      <SelectItem value={Gender.OTHER}>
                        {t("options.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2">
              <DialogClose asChild>
                <Button variant="outline">{t("actions.cancel")}</Button>
              </DialogClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? t("actions.saving") : t("actions.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
