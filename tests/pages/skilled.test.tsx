import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { SkilledContent } from "@/app/[locale]/services/skilled/SkilledContent";
import { services } from "@/lib/site-config";

function renderSkilled() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SkilledContent />
    </NextIntlClientProvider>,
  );
}

describe("Skilled services page", () => {
  it("renders exactly one h1", () => {
    renderSkilled();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders all seven discipline names from site-config", () => {
    renderSkilled();
    for (const service of services) {
      expect(screen.getAllByText(service.name).length).toBeGreaterThan(0);
    }
  });

  it("renders a readable Conditions We Support section, white text on a dark section", () => {
    renderSkilled();
    const chip = screen.getByText("Wound care");
    expect(chip).toBeInTheDocument();
    expect(chip.className).toMatch(/text-white/);
    const darkSection = chip.closest("section");
    expect(darkSection?.className).toMatch(/bg-navy/);
  });

  it("contains no payer, program, or insurance content", () => {
    const { container } = renderSkilled();
    expect(container.textContent).not.toMatch(
      /medicaid|insurance|commercial plan|private pay|star\+plus|phc|\bcas\b/i,
    );
    // "Medicare-certified" (credential eyebrow) would be acceptable if present,
    // but Medicare must never appear as a payer/coverage list item.
    expect(container.textContent).not.toMatch(/medicare(?!-certified)/i);
  });
});
