import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home and every page for both locales", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com");
    expect(urls).toContain("https://www.mylifecareoptions.com/services");
    expect(urls).toContain("https://www.mylifecareoptions.com/es/services");
    expect(urls.length).toBeGreaterThanOrEqual(18); // 9 routes x 2 locales
  });
});
