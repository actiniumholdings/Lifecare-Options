import { siteConfig } from "@/lib/site-config";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

/**
 * Returns a JSON-LD object for the MedicalBusiness (LocalBusiness subtype).
 * Rendered server-side into a <script type="application/ld+json"> by <JsonLd>.
 *
 * Single telephone line. No logo/image (no /icon route in this project).
 */
export function medicalBusinessJsonLd(): Record<string, unknown> {
  const identifiers: Array<Record<string, string>> = [];

  if (siteConfig.medicareCcn) {
    identifiers.push({
      "@type": "PropertyValue",
      name: "Medicare CCN",
      value: siteConfig.medicareCcn,
    });
  }

  if (siteConfig.stateLicense) {
    identifiers.push({
      "@type": "PropertyValue",
      name: "Texas Home Health License",
      value: siteConfig.stateLicense,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: siteConfig.phone,
    faxNumber: siteConfig.fax,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    areaServed: siteConfig.serviceArea.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    openingHours: ["Mo-Th 08:00-17:00", "Fr 08:00-16:00"],
    identifier: identifiers,
  };
}
