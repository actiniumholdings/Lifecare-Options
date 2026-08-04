import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Spanish ("es") is temporarily disabled: messages/es.json is an untranslated
  // copy of en.json, so /es would serve English at Spanish URLs. To re-enable
  // once real translations land, restore ["en", "es"] here and revert the
  // matching changes in app/sitemap.ts and lib/metadata.ts (hreflang alternates).
  locales: ["en"],
  defaultLocale: "en",
  // English served at `/`; Spanish will be prefixed at `/es` when re-enabled.
  localePrefix: "as-needed",
});
