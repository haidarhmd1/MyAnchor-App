import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar", "de"],

  // Used when no locale matches
  defaultLocale: "en",
});
