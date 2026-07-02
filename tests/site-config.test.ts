import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { coverageCounties } from "@/lib/coverage-counties";

describe("service area data", () => {
  it("covers Harris and Fort Bend and lists Katy-area cities", () => {
    expect(siteConfig.serviceArea.counties.map((c) => c.name)).toEqual([
      "Harris County",
      "Fort Bend County",
    ]);
    expect(siteConfig.serviceArea.cities).toContain("Katy");
    expect(siteConfig.serviceArea.cities.length).toBeGreaterThanOrEqual(8);
  });
  it("exposes specialties", () => {
    expect(siteConfig.specialties.length).toBeGreaterThanOrEqual(6);
  });
  it("starts with honest-empty positions and testimonials", () => {
    expect(siteConfig.positions).toEqual([]);
    expect(siteConfig.testimonials).toEqual([]);
  });
  it("maps counties to colors for the map", () => {
    expect(coverageCounties.map((c) => c.name)).toEqual([
      "Harris County",
      "Fort Bend County",
    ]);
  });
  it("carries the recovered CCN and state license", () => {
    expect(siteConfig.medicareCcn).toBe("747061");
    expect(siteConfig.stateLicense).toBe("011908");
  });
});
