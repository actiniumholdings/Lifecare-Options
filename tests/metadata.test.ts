import { describe, expect, it } from "vitest";
import { buildMetadata, SITE_URL } from "@/lib/metadata";

describe("buildMetadata", () => {
  it("builds a localized canonical + hreflang alternates", () => {
    const m = buildMetadata({ title: "Services", description: "d", path: "/services", locale: "en" });
    expect(m.title).toBe("Services");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services`);
    expect(m.alternates?.languages?.["es"]).toBe(`${SITE_URL}/es/services`);
    expect(m.alternates?.languages?.["en"]).toBe(`${SITE_URL}/services`);
    expect(m.alternates?.languages?.["x-default"]).toBe(`${SITE_URL}/services`);
    expect(m.openGraph?.url).toBe(`${SITE_URL}/services`);
  });
  it("uses the site root for the home path", () => {
    const m = buildMetadata({ title: "Home", path: "/", locale: "en" });
    expect(m.alternates?.canonical).toBe(SITE_URL);
    expect(m.alternates?.languages?.["es"]).toBe(`${SITE_URL}/es`);
    expect(m.alternates?.languages?.["x-default"]).toBe(SITE_URL);
  });
});
