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

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dobFormatted = dob
    ? DateTime.fromJSDate(dob)
        .setLocale(locale)
        .toLocaleString(DateTime.DATE_SHORT)
    : null;

  const formKey = useMemo(() => {
    const iso = dob ? DateTime.fromJSDate(dob).toISODate() : "null";
    return `${open ? "open" : "closed"}-${iso}`;
  }, [open, dob]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring/70 w-full rounded-2xl text-left transition focus:outline-none focus-visible:ring-2"
        >
          <SettingsRowInput
            label={t("dob.label")}
            value={dob ? (dobFormatted as string) : t("dob.notSet")}
          />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-card text-card-foreground border-border rounded-3xl border shadow-lg">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-foreground text-lg font-semibold tracking-tight">
            {t("dob.dialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <DobFormInner
          key={formKey}
          initialDob={dob}
          onSaved={() => {
            setOpen(false);
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
  onSaved,
  isPending,
}: {
  initialDob: Date | null;
  onSaved: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("form");
  const locale = useLocale();

  const form = useForm<FormValues>({
    defaultValues: { dob: initialDob },
  });

  const selectedLabel = (value: Date) =>
    DateTime.fromJSDate(value)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_MED);

  const handleSave = async (data: FormValues) => {
    try {
      if (!data.dob) {
        toast.error(t("dob.toast.error"));
        return;
      }

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
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-foreground text-sm font-medium">
                {t("dob.label")}
              </FormLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "bg-background text-foreground border-border hover:bg-muted h-12 w-full justify-start rounded-2xl px-4 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        selectedLabel(field.value)
                      ) : (
                        <span>{t("dob.pickDate")}</span>
                      )}
                      <CalendarIcon className="text-muted-foreground ml-auto h-4 w-4" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent
                  className="bg-popover text-popover-foreground border-border w-auto rounded-2xl border p-0 shadow-lg"
                  align="start"
                >
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
