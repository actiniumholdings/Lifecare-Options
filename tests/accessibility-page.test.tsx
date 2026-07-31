import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { axe } from "vitest-axe";
import AccessibilityPage from "@/app/accessibility/page";

describe("Accessibility statement page", () => {
  it("states a conformance target rather than an unqualified compliance claim", () => {
    const { container } = render(<AccessibilityPage />);
    expect(container.textContent).toMatch(/working toward conformance/i);
    expect(container.textContent).toMatch(/WCAG 2\.1/);
    expect(container.textContent).toMatch(/Level AA/i);
  });

  // The FTC's accessiBe order (2025) makes unsubstantiated conformance claims a
  // real liability. No third-party audit has been done, so this page must not
  // assert finished compliance. Guarding it in a test keeps a future well-meaning
  // copy edit from quietly reintroducing the claim.
  it("does not assert that the site is already compliant or conformant", () => {
    const { container } = render(<AccessibilityPage />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\bis (?:fully )?(?:ADA[- ])?compliant\b/i);
    expect(text).not.toMatch(/\bwe are (?:fully )?compliant\b/i);
    expect(text).not.toMatch(/\baccessible to everyone\b/i);
    // The counterpart: the hedge itself must survive. "fully conforms" is
    // allowed to appear, but only inside this disclaimer.
    expect(text).toMatch(/cannot represent that this site fully conforms/i);
  });

  it("discloses that no independent audit has been completed", () => {
    const { container } = render(<AccessibilityPage />);
    expect(container.textContent).toMatch(/not yet completed an independent audit/i);
  });

  it("gives a working way to report a barrier", () => {
    render(<AccessibilityPage />);
    const phone = screen.getByRole("link", { name: /281.*9546/ });
    expect(phone).toHaveAttribute("href", "tel:+12816469546");
    expect(
      screen.getByRole("link", { name: /contact form/i })
    ).toHaveAttribute("href", "/#contact");
  });

  it("has no axe-detected a11y violations", async () => {
    const { container } = render(<AccessibilityPage />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 20000);
});
