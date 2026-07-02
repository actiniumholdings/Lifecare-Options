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

  it("shows attendant payers without claiming Medicare for attendant care", () => {
    render(<Pillars />);
    // The attendant payer hint names Medicaid programs + private pay, never Medicare.
    const attendantPayers = screen.getByText(/PHC.*CAS.*FC/i);
    expect(attendantPayers).toBeInTheDocument();
    expect(attendantPayers.textContent).not.toMatch(/medicare/i);
  });
});
