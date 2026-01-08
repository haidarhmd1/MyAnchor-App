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
import { useMemo, useState, useTransition } from "react";
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
      return "gender.options.female";
    case Gender.MALE:
      return "gender.options.male";
    case Gender.OTHER:
      return "gender.options.other";
    default:
      return "gender.notSet";
  }
};

type FormValues = { gender: Gender | string };

export const GenderPicker = ({
  label,
  gender,
}: {
  label?: string;
  gender: string;
}) => {
  const t = useTranslations("form");
  const router = useRouter();

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Remount form when dialog opens OR when server value changes -> defaultValues re-applied
  const formKey = useMemo(() => {
    return `${open ? "open" : "closed"}-${gender ?? ""}`;
  }, [open, gender]);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
          <SettingsRowInput
            label={t("gender.label")}
            value={t(genderKey(gender))}
          />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("gender.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <GenderFormInner
          key={formKey}
          initialGender={gender}
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

function GenderFormInner({
  initialGender,
  t,
  isPending,
  onSaved,
}: {
  initialGender: string;
  t: ReturnType<typeof useTranslations>;
  isPending: boolean;
  onSaved: () => void;
}) {
  const form = useForm<FormValues>({
    defaultValues: { gender: initialGender },
  });

  const handleSave = async (data: FormValues) => {
    try {
      // Optional guard: if you allow "not set", adjust this logic as needed
      if (!data.gender) return;

      await updateUserProfile({
        data: {
          gender: data.gender as Gender,
        },
      });

      toast.success(t("gender.toast.success"));
      onSaved();
    } catch (error) {
      toast.error(t("gender.toast.error"));
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("gender.placeholder")} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value={Gender.MALE}>
                    {t("gender.options.male")}
                  </SelectItem>
                  <SelectItem value={Gender.FEMALE}>
                    {t("gender.options.female")}
                  </SelectItem>
                  <SelectItem value={Gender.OTHER}>
                    {t("gender.options.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

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
    </Form>
  );
}
