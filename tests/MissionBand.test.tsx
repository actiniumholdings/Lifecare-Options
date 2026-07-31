import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MissionBand } from "@/components/MissionBand";
import { TrustTicker } from "@/components/TrustTicker";

describe("MissionBand", () => {
  it("speaks in the agency's own voice", () => {
    const { container } = render(<MissionBand />);
    expect(container.textContent).toMatch(/healing happens best/i);
  });

  // The design kit shipped an invented patient testimonial here ("Sarah M.,
  // daughter of patient"). A fabricated consumer testimonial violates the FTC's
  // Rule on Consumer Reviews and Testimonials (16 CFR Part 465), and a real one
  // would need HIPAA authorization. Guard against it being pasted back in.
  it("attributes nothing to a patient or family member", () => {
    const { container } = render(<MissionBand />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/daughter of patient/i);
    expect(text).not.toMatch(/\bSarah M\b/);
    expect(text).not.toMatch(/—\s*[A-Z][a-z]+ [A-Z]\.,/);
  });
});

describe("TrustTicker", () => {
  it("lists verifiable credentials only", () => {
    const { container } = render(<TrustTicker />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/medicare-certified/i);
    expect(text).toMatch(/CHAP-accredited/i);
    expect(text).toMatch(/serving katy since 2008/i);
  });
});
