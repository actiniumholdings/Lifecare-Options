import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { HomeContent as HomePage } from "@/app/[locale]/HomeContent";

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <HomePage />
    </NextIntlClientProvider>,
  );
}

describe("Homepage smoke", () => {
  it("renders hero, trust stats, services, and contact form", () => {
    const { container } = renderHome();
    expect(container.textContent).toMatch(/quality care/i);
    expect(container.textContent).toMatch(/medicare-certified/i);
    // LeadForm tabs should be present on initial render
    expect(container.textContent).toMatch(/services inquiry/i);
    expect(container.textContent).toMatch(/work with us/i);
  });

  it("has no axe-detected a11y violations on initial render", async () => {
    const { container } = renderHome();
    const results = await axe(container);
    // Using direct violations check instead of vitest-axe's toHaveNoViolations
    // matcher — Vitest 4 changed the namespace that custom matchers augment,
    // and vitest-axe's types haven't caught up yet.
    expect(results.violations).toEqual([]);
  });
});
