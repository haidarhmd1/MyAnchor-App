import { DateTime } from "luxon";

function getRelativeTimeKey(unit: string, value: number) {
  // map Luxon units to your i18n keys
  // Luxon gives "years|months|days|hours|minutes|seconds"
  // we’ll keep both singular/plural keys in i18n
  const singular = unit.replace(/s$/, "");
  const isOne = Math.abs(value) === 1;
  return isOne ? singular : unit;
}

export function formatRelative(t: any, locale: string, date: Date) {
  const dt = DateTime.fromJSDate(date).setLocale(locale);
  const now = DateTime.now().setLocale(locale);

  // Luxon’s humanize is good but not fully controllable via i18n keys,
  // so we compute the best unit ourselves.
  const diff = dt
    .diff(now, [
      "years",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
    ])
    .toObject();

  const candidates: Array<keyof typeof diff> = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];

  let unit: keyof typeof diff = "seconds";
  for (const u of candidates) {
    const v = diff[u] ?? 0;
    if (Math.abs(v) >= 1) {
      unit = u;
      break;
    }
  }

  const value = Math.round(diff[unit] ?? 0);

  if (value === 0) return t("common.timeJustNow");

  const unitKey = getRelativeTimeKey(unit, value);

  // future vs past
  if (value > 0) {
    return t("common.timeIn", { value, unit: t(`common.timeUnit.${unitKey}`) });
  }
  return t("common.timeAgo", {
    value: Math.abs(value),
    unit: t(`common.timeUnit.${unitKey}`),
  });
}
