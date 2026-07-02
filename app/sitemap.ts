import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const routes = [
  "",
  "/services",
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
    // English URL: bare SITE_URL for home, SITE_URL + route otherwise
    entries.push({
      url: route === "" ? SITE_URL : `${SITE_URL}${route}`,
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
    });

    // Spanish URL: SITE_URL/es for home, SITE_URL/es + route otherwise
    entries.push({
      url: route === "" ? `${SITE_URL}/es` : `${SITE_URL}/es${route}`,
      changeFrequency: "monthly",
      priority: route === "" ? 1.0 : 0.8,
    });
  }

  return entries;
}
