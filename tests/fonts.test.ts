import { describe, expect, it, vi } from "vitest";

// next/font/google exports are empty outside the Next.js bundler (the
// index.js is literally 0 bytes — it's compiled by Next's webpack loader).
// Mock the constructors so the test verifies the contract: correct font
// variable strings are wired to the exported objects.
vi.mock("next/font/google", () => ({
  Young_Serif: (o: { variable: string }) => ({ variable: o.variable }),
  Nunito_Sans: (o: { variable: string }) => ({ variable: o.variable }),
}));

import { youngSerif, nunitoSans } from "@/lib/fonts";

describe("fonts", () => {
  it("exposes CSS variables for Young Serif and Nunito Sans", () => {
    expect(youngSerif.variable).toBe("--font-young-serif");
    expect(nunitoSans.variable).toBe("--font-nunito-sans");
  });
});
