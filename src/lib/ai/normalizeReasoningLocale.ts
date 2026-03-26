import { SupportedReasoningLocale } from "./anxietySupport/types";

export function normalizeReasoningLocale(
  locale: string | undefined | null,
): SupportedReasoningLocale {
  if (locale === "ar-LB") return "ar-LB";
  if (locale?.startsWith("ar")) return "ar";
  if (locale?.startsWith("de")) return "de";
  return "en";
}
