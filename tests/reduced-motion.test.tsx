import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

// Force the reduced-motion hook to report true *before* importing the page,
// so all motion components mount in their reduced-motion branch.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

// Import after the mock is registered.
import { HomeContent as HomePage } from "@/app/[locale]/HomeContent";
import { services } from "@/lib/site-config";

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <HomePage />
    </NextIntlClientProvider>,
  );
}

describe("Homepage with prefers-reduced-motion: reduce", () => {
  it("renders all critical hero, trust, and services content visibly", () => {
    const { container } = renderHome();
    const text = container.textContent ?? "";

    // Hero
    expect(text).toMatch(/quality care/i);
    expect(text).toMatch(/felt at home/i);
    expect(text).toMatch(/request info/i);

    // Trust stats (from en.json messages)
    expect(text).toMatch(/medicare/i);
    expect(text).toMatch(/24\/7/i);

    // Every service name rendered by ServicesList
    for (const s of services) {
      expect(text).toContain(s.name);
    }

    // Lead form is present (contact section)
    expect(text).toMatch(/services inquiry/i);
  });
});
