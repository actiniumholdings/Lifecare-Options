import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import HomePage from "@/app/[locale]/page";

describe("Homepage smoke", () => {
  it("renders hero, trust strip, about, services, and contact form", () => {
    const { container } = render(<HomePage />);
    expect(container.textContent).toMatch(/quality care/i);
    expect(container.textContent).toMatch(/medicare-certified/i);
    expect(container.textContent).toMatch(/get in touch/i);
    // LeadForm tabs should be present on initial render
    expect(container.textContent).toMatch(/services inquiry/i);
    expect(container.textContent).toMatch(/work with us/i);
  });

  it("has no axe-detected a11y violations on initial render", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    // Using direct violations check instead of vitest-axe's toHaveNoViolations
    // matcher — Vitest 4 changed the namespace that custom matchers augment,
    // and vitest-axe's types haven't caught up yet.
    expect(results.violations).toEqual([]);
  });
});
