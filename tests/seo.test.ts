import { describe, expect, it } from "vitest";
import { medicalBusinessJsonLd } from "@/lib/seo";

describe("medicalBusinessJsonLd", () => {
  it("emits the agency's real NAP + credentials", () => {
    const d = medicalBusinessJsonLd();
    expect(d["@type"]).toBe("MedicalBusiness");
    expect(d.name).toBe("Lifecare Options");
    expect(d.telephone).toContain("281");
    expect((d.address as Record<string, unknown>).addressLocality).toBe("Katy");
    expect(JSON.stringify(d)).toContain("747061"); // CCN present
  });

  it("lists both service lines in availableService, honestly typed", () => {
    const d = medicalBusinessJsonLd();
    const services = d.availableService as Array<Record<string, unknown>>;
    expect(Array.isArray(services)).toBe(true);

    const names = services.map((s) => s.name);
    expect(names).toContain("Skilled Home Health");
    expect(names).toContain("Provider Attendant Services");

    // Compliance: no payer/program names in the structured data.
    const json = JSON.stringify(services);
    expect(json).not.toMatch(/medicare|medicaid|star\+plus|phc|\bcas\b|\bfc\b|private pay|commercial plan|insurance/i);
  });
});
