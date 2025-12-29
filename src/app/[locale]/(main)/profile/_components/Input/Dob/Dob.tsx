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
import React, { useState, useTransition } from "react";
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

export const Dob = ({ dob }: { dob: Date | null }) => {
  const t = useTranslations("dob");
  const locale = useLocale();
  const router = useRouter();

  const form = useForm({
    defaultValues: { dob },
  });

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (data: { dob: Date | null }) => {
    try {
      await updateUserProfile({
        data: { dob: data.dob! },
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

  // display on settings row (you can change format if you prefer)
  const dobFormatted = dob
    ? DateTime.fromJSDate(dob)
        .setLocale(locale)
        .toLocaleString(DateTime.DATE_SHORT)
    : null;

  // display in button (localized “medium” date)
  const selectedLabel = (value: Date) =>
    DateTime.fromJSDate(value)
      .setLocale(locale)
      .toLocaleString(DateTime.DATE_MED);

  return (
    <Dialog open={open} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <SettingsRowInput
          label={t("label")}
          value={dob ? (dobFormatted as string) : t("notSet")}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
        </DialogHeader>

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
                  <FormLabel>{t("label")}</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            selectedLabel(field.value)
                          ) : (
                            <span>{t("pickDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
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
