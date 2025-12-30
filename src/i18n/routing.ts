import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "ar", "ar-LB"],
  defaultLocale: "en",

  localeDetection: true,
});
