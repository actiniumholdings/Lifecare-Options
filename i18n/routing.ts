import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English served at `/`, Spanish prefixed at `/es`.
  localePrefix: "as-needed",
});
