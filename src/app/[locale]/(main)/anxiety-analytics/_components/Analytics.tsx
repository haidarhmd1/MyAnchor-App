"use client";

import { Spinner } from "@/components/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { getAnxietyAnalytics } from "@/lib/api";
import { TaxonomyType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export type AnalyticsRow = {
  id: string;
  date: string;
  typesOfBodySymptoms: (
    | {
        label: string;
        id: string;
        type: TaxonomyType;
      }
    | undefined
  )[];
  typesOfSituationYouWereIn:
    | {
        label: string;
        id: string;
        type: TaxonomyType;
      }
    | undefined;
};

type AnalyticsProps = {
  journalWithLabels: AnalyticsRow[];
  dateRange: { month: number; year: number }[];
};

function toMonthISO(month: number, year: number): string {
  const m = String(month).padStart(2, "0");
  return `${year}-${m}-01`;
}

export const Analytics = ({ journalWithLabels, dateRange }: AnalyticsProps) => {
  const initialRows = useMemo<AnalyticsRow[]>(
    () =>
      journalWithLabels.map((j) => ({
        id: j.id,
        date: j.date,
        typesOfBodySymptoms: j.typesOfBodySymptoms,
        typesOfSituationYouWereIn: j.typesOfSituationYouWereIn,
      })),
    [journalWithLabels],
  );

  const { data, isPending, mutateAsync } = useMutation<
    AnalyticsRow[],
    Error,
    string
  >({
    mutationFn: (isoStartDate) => getAnxietyAnalytics(isoStartDate),
  });

  const rows = !data ? initialRows : data;

  return (
    <>
      <div className="mb-8 w-full">
        <Select
          defaultValue={`${dateRange[0].month} ${dateRange[0].year}`}
          onValueChange={async (value) => {
            const [monthStr, yearStr] = value.split(" ");
            const iso = toMonthISO(Number(monthStr), Number(yearStr));
            await mutateAsync(iso);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue className="w-full" placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {dateRange.map((d) => (
              <SelectItem
                key={`${d.month} ${d.year}`}
                value={`${d.month} ${d.year}`}
              >
                {new Date(d.year, d.month - 1).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {d.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <Spinner />
      ) : (
        <Timeline>
          {rows.map((item, index) => {
            return (
              <TimelineItem
                key={item.id}
                step={index}
                className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-8"
              >
                <TimelineHeader>
                  <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                  <TimelineTitle className="mt-0.5">
                    {item.typesOfSituationYouWereIn?.label}
                  </TimelineTitle>
                  <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7" />
                </TimelineHeader>
                <TimelineContent className="text-foreground mt-2 rounded-lg border px-4 py-3">
                  {item.typesOfBodySymptoms.map((t) => t?.label).join(" ,")}
                  <TimelineDate>
                    {new Date(item.date).toLocaleString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
    </>
  );
};
