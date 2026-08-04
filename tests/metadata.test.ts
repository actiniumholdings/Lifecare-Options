import { describe, expect, it } from "vitest";
import { buildMetadata, SITE_URL } from "@/lib/metadata";

describe("buildMetadata", () => {
  it("builds a localized canonical (no hreflang while es is disabled)", () => {
    const m = buildMetadata({ title: "Services", description: "d", path: "/services", locale: "en" });
    expect(m.title).toBe("Services");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services`);
    // hreflang alternates intentionally absent while the site is English-only
    expect(m.alternates?.languages).toBeUndefined();
    expect(m.openGraph?.url).toBe(`${SITE_URL}/services`);
  });
  it("uses the site root for the home path", () => {
    const m = buildMetadata({ title: "Home", path: "/", locale: "en" });
    expect(m.alternates?.canonical).toBe(SITE_URL);
    expect(m.alternates?.languages).toBeUndefined();
  });
});
