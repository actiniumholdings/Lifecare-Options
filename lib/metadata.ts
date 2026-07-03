import type { Metadata } from "next";

/** Canonical domain — also set as `metadataBase` in the root layout. */
export const SITE_URL = "https://www.mylifecareoptions.com";

/** Full brand name used as title suffix and OG site name. */
export const SITE_NAME = "Lifecare Options";

/** Title template applied to every child segment via root layout. */
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/**
 * Default meta description — plain, factual, no superlatives.
 * Used when a page provides no override.
 */
export const DEFAULT_DESCRIPTION =
  "Medicare-certified skilled home health. Nursing, therapy, and personal care " +
  "at home across Katy, Fort Bend, and Harris counties since 2012.";

interface BuildMetadataOptions {
  /** Short page title — inherits the "%s | Lifecare Options" template from root layout. */
  title: string;
  /** Page-specific description. Falls back to DEFAULT_DESCRIPTION if omitted. */
  description?: string;
  /**
   * Canonical path, relative, e.g. "/" or "/services".
   * Must start with "/".
   */
  path: string;
  /** Active locale for this page ("en" or "es"). */
  locale: string;
}

/**
 * Resolve an absolute URL for a given locale + path.
 * - en:  SITE_URL + path  (path "/" → SITE_URL bare)
 * - es:  SITE_URL/es + path  (path "/" → SITE_URL/es)
 */
function abs(locale: string, path: string): string {
  const prefix = locale === "es" ? `${SITE_URL}/es` : SITE_URL;
  const suffix = path === "/" ? "" : path;
  return prefix + suffix;
}

/**
 * Build per-page Next `Metadata` with title, description, canonical URL,
 * hreflang alternates (en + es), OpenGraph, and Twitter fields.
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  locale,
}: BuildMetadataOptions): Metadata {
  const canonical = abs(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: abs("en", path),
        es: abs("es", path),
        "x-default": abs("en", path),
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_US" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
