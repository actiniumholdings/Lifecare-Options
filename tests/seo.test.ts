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
});
