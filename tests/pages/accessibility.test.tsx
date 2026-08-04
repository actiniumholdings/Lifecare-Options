import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AccessibilityContent as AccessibilityPage } from "@/app/[locale]/accessibility/AccessibilityContent";

function renderAccessibility() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AccessibilityPage />
    </NextIntlClientProvider>,
  );
}

describe("Accessibility page", () => {
  it("renders the h1", () => {
    renderAccessibility();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeDefined();
  });

  it("contains the text 'WCAG'", () => {
    renderAccessibility();
    const matches = screen.getAllByText(/WCAG/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("shows the contact email", () => {
    renderAccessibility();
    const matches = screen.getAllByText(/intake@mylifecareoptions\.com/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
