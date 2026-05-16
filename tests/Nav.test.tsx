import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Nav } from "@/components/Nav";

describe("Nav", () => {
  it("renders the site name", () => {
    render(<Nav />);
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });

  it("renders the phone number as a tel: link", () => {
    render(<Nav />);
    const phones = screen.getAllByRole("link", { name: /281.*9546/i });
    expect(phones[0]).toHaveAttribute("href", "tel:+12816469546");
  });

  it("has a Request info CTA anchoring to #contact", () => {
    render(<Nav />);
    const ctas = screen.getAllByRole("link", { name: /request info/i });
    expect(ctas[0]).toHaveAttribute("href", "#contact");
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("renders without crashing at scrollY=0 (default state)", () => {
    // Reset scroll position before render
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    render(<Nav />);
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });
});

describe("Nav mobile phone chip", () => {
  it("renders a visible phone tel: link without opening the hamburger", () => {
    render(<Nav />);
    const chip = screen.getByTestId("mobile-phone-chip");
    expect(chip).toHaveAttribute("href", "tel:+12816469546");
    expect(chip).toHaveTextContent(/281.*9546/i);
  });
});
