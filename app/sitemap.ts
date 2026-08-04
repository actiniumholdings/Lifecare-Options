import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const routes = [
  "",
  "/services",
  "/services/skilled",
  "/services/attendant",
  "/about",
  "/service-area",
  "/careers",
  "/refer",
  "/contact",
  "/remote-patient-monitoring",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // English URL: bare SITE_URL for home, SITE_URL + route otherwise.
    // Spanish URLs intentionally omitted while the "es" locale is disabled
    // (see i18n/routing.ts) — restore the /es entries when it re-enables.
    entries.push({
      url: route === "" ? SITE_URL : `${SITE_URL}${route}`,
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
    });
  }

  return entries;
}
