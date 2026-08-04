import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pillars } from "@/components/home/Pillars";

describe("Home Pillars — two service lines", () => {
  it("renders both pillars linking to their dedicated pages", () => {
    render(<Pillars />);
    expect(
      screen.getByRole("heading", { name: /skilled home health/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /provider attendant services/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore skilled/i })).toHaveAttribute(
      "href",
      "/services/skilled"
    );
    expect(screen.getByRole("link", { name: /explore attendant/i })).toHaveAttribute(
      "href",
      "/services/attendant"
    );
  });

  it("keeps payer/funding info off the pillar cards (per client direction)", () => {
    const { container } = render(<Pillars />);
    // No payer/funding captions on the cards: no Medicaid/STAR+PLUS/private-pay
    // on attendant, no Medicare/commercial-plans line on skilled.
    expect(container.textContent).not.toMatch(/PHC|CAS|STAR\+PLUS/i);
    expect(container.textContent).not.toMatch(/private pay/i);
    expect(container.textContent).not.toMatch(/medicare advantage|commercial plans/i);
    // The attendant eyebrow no longer reads "Medicaid · Private pay".
    expect(container.textContent).not.toMatch(/medicaid/i);
  });
});
