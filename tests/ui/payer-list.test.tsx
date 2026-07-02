import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PayerList } from "@/components/ui/PayerList";

const payers = ["Medicare", "Medicaid (PHC · CAS · FC)", "STAR+PLUS plans", "Private pay"];

describe("PayerList", () => {
  it("renders every payer as a list item chip", () => {
    render(<PayerList payers={payers} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("STAR+PLUS plans")).toBeInTheDocument();
  });

  it("dark tone renders white-on-navy readable chips", () => {
    render(<PayerList payers={payers} tone="dark" />);
    const chip = screen.getByText("Medicare");
    expect(chip.className).toContain("text-white");
    expect(chip.className).toContain("border-white/30");
  });

  it("renders the optional note", () => {
    render(<PayerList payers={payers} note="We verify benefits at no cost." />);
    expect(screen.getByText("We verify benefits at no cost.")).toBeInTheDocument();
  });
});
