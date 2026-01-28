import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import { getLocale } from "next-intl/server";

function getLocalizedWeekdays(locale: Intl.LocalesArgument) {
  const yearNow = new Date().getUTCFullYear();
  const dayNow = new Date().getUTCDay();
  const monthNow = new Date().getUTCMonth();
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  return [...Array(7).keys()].map((day) =>
    formatter.format(new Date(Date.UTC(yearNow, monthNow, dayNow + day))),
  );
}

export async function momentLogAnalytics() {
  const locale = await getLocale();
  const dayNow = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    new Date().getUTCDay(),
  );
  const todaysDate = DateTime.now().setLocale(locale).toFormat("MMMM dd, yyyy");
  const weekdays = getLocalizedWeekdays(locale);

  return (
    <div className="space-x-4 rounded-3xl bg-white p-4 shadow-md">
      <p className="text-lg font-medium">{todaysDate}</p>
      <div className="mt-1 mb-4 h-px w-48 bg-gray-200" />
      <div className="grid w-full grid-rows-2 gap-y-2">
        <div className="grid w-full grid-cols-7 justify-items-center text-center">
          {weekdays.map((day) => (
            <p
              key={day}
              className={cn(
                "w-full",
                dayNow === day ? "text-red-300" : "text-black",
              )}
            >
              {day}
            </p>
          ))}
        </div>

        <div className="grid w-full grid-cols-7 justify-items-center">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-gray-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
