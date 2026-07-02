import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home and every page for both locales", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com");
    expect(urls).toContain("https://www.mylifecareoptions.com/services");
    expect(urls).toContain("https://www.mylifecareoptions.com/es/services");
    expect(urls.length).toBeGreaterThanOrEqual(22); // 11 routes x 2 locales
  });

  it("includes /services/skilled and /services/attendant for both locales", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com/services/skilled");
    expect(urls).toContain("https://www.mylifecareoptions.com/es/services/skilled");
    expect(urls).toContain("https://www.mylifecareoptions.com/services/attendant");
    expect(urls).toContain("https://www.mylifecareoptions.com/es/services/attendant");
  });
});
