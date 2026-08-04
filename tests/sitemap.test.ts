import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home and every page (English only while es is disabled)", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com");
    expect(urls).toContain("https://www.mylifecareoptions.com/services");
    expect(urls.length).toBeGreaterThanOrEqual(11); // 11 routes x 1 locale
  });

  it("includes /services/skilled and /services/attendant", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com/services/skilled");
    expect(urls).toContain("https://www.mylifecareoptions.com/services/attendant");
  });

  it("omits /es URLs while the Spanish locale is disabled", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls.some((u) => u.includes("/es"))).toBe(false);
  });
});
