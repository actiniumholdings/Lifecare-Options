import { describe, expect, it, vi } from "vitest";

// next/font/google exports are empty outside the Next.js bundler (the
// index.js is literally 0 bytes — it's compiled by Next's webpack loader).
// Mock the constructors so the test verifies the contract: correct font
// variable strings are wired to the exported objects.
vi.mock("next/font/google", () => ({
  Fraunces: (o: { variable: string }) => ({ variable: o.variable }),
  Inter: (o: { variable: string }) => ({ variable: o.variable }),
}));

import { fraunces, inter } from "@/lib/fonts";

describe("fonts", () => {
  it("exposes CSS variables for Fraunces and Inter", () => {
    expect(fraunces.variable).toBe("--font-fraunces");
    expect(inter.variable).toBe("--font-inter");
  });
});
