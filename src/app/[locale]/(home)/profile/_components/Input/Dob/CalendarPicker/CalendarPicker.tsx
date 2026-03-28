"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";

export function CalendarPicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  const t = useTranslations("form.dob");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);

  const formattedDate = date
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date)
    : t("pickDate");

  return (
    <div className="flex flex-col gap-3">
      <Label
        htmlFor="date"
        className="text-foreground px-1 text-sm font-medium"
      >
        {t("label")}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="bg-card text-foreground border-border hover:bg-muted flex h-12 w-full items-center justify-between rounded-2xl px-4 font-normal"
          >
            <span
              className={date ? "text-foreground" : "text-muted-foreground"}
            >
              {formattedDate}
            </span>

            <ChevronDownIcon className="text-muted-foreground h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="bg-popover text-popover-foreground border-border w-auto overflow-hidden rounded-2xl border p-0 shadow-lg"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
