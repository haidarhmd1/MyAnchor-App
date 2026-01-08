"use client";

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
import { Button } from "@/components/ui/button";
import { useMemo, useState, useTransition } from "react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";

type FormValues = { dob: Date | null };

export const Dob = ({ dob }: { dob: Date | null }) => {
  const t = useTranslations("form");
  const locale = useLocale();
  const router = useRouter();

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dobFormatted = dob
    ? DateTime.fromJSDate(dob)
        .setLocale(locale)
        .toLocaleString(DateTime.DATE_SHORT)
    : null;

  const selectedLabel = (value: Date) =>
    DateTime.fromJSDate(value)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_MED);

  // Key changes when the incoming dob changes (or when dialog opens) -> form remounts -> defaultValues re-applied
  const formKey = useMemo(() => {
    const iso = dob ? DateTime.fromJSDate(dob).toISODate() : "null";
    return `${open ? "open" : "closed"}-${iso}`;
  }, [open, dob]);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="w-full text-left">
          <SettingsRowInput
            label={t("dob.label")}
            value={dob ? (dobFormatted as string) : t("dob.notSet")}
          />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dob.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <DobFormInner
          key={formKey}
          initialDob={dob}
          t={t}
          selectedLabel={selectedLabel}
          onSaved={() => {
            setIsOpen(false);
            startTransition(() => router.refresh());
          }}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

function DobFormInner({
  initialDob,
  t,
  selectedLabel,
  onSaved,
  isPending,
}: {
  initialDob: Date | null;
  t: ReturnType<typeof useTranslations>;
  selectedLabel: (value: Date) => string;
  onSaved: () => void;
  isPending: boolean;
}) {
  const form = useForm<FormValues>({
    defaultValues: { dob: initialDob },
  });

  const handleSave = async (data: FormValues) => {
    try {
      if (!data.dob) return;

      await updateUserProfile({
        data: { dob: data.dob },
      });

      toast.success(t("dob.toast.success"));
      onSaved();
    } catch (error) {
      toast.error(t("dob.toast.error"));
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("dob.label")}</FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        selectedLabel(field.value)
                      ) : (
                        <span>{t("dob.pickDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
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
