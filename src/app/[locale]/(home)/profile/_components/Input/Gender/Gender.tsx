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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Gender } from "@/generated/prisma/enums";

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

export const GenderPicker = ({ gender }: { gender: string }) => {
  const t = useTranslations("form");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formKey = useMemo(() => {
    return `${open ? "open" : "closed"}-${gender ?? ""}`;
  }, [open, gender]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring/70 w-full rounded-2xl text-left transition focus:outline-none focus-visible:ring-2"
        >
          <SettingsRowInput
            label={t("gender.label")}
            value={t(genderKey(gender))}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-card text-card-foreground border-border rounded-3xl border shadow-lg">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-foreground text-lg font-semibold tracking-tight">
            {t("gender.dialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <GenderFormInner
          key={formKey}
          initialGender={gender}
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

function GenderFormInner({
  initialGender,
  isPending,
  onSaved,
}: {
  initialGender: string;
  isPending: boolean;
  onSaved: () => void;
}) {
  const t = useTranslations("form");

  const form = useForm<FormValues>({
    defaultValues: { gender: initialGender },
  });

  const handleSave = async (data: FormValues) => {
    try {
      if (!data.gender) {
        toast.error(t("gender.toast.error"));
        return;
      }

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
                  <SelectTrigger className="bg-background text-foreground border-border h-12 w-full rounded-2xl">
                    <SelectValue placeholder={t("gender.placeholder")} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="bg-popover text-popover-foreground border-border rounded-2xl border shadow-lg">
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
    </Form>
  );
}
