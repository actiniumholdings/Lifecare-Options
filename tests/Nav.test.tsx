import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { NextIntlClientProvider } from "next-intl";
import { Nav } from "@/components/Nav";
import messages from "@/messages/en.json";

function renderNav() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Nav />
    </NextIntlClientProvider>
  );
}

describe("Nav", () => {
  it("renders the site name", () => {
    renderNav();
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });

  it("renders the phone number as a tel: link", () => {
    renderNav();
    const phones = screen.getAllByRole("link", { name: /281.*9546/i });
    expect(phones[0]).toHaveAttribute("href", "tel:+12816469546");
  });

  it("has a Request info CTA anchoring to #contact", () => {
    renderNav();
    const ctas = screen.getAllByRole("link", { name: /request info/i });
    expect(ctas[0]).toHaveAttribute("href", "#contact");
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("renders without crashing at scrollY=0 (default state)", () => {
    // Reset scroll position before render
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    renderNav();
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });
});

describe("Nav mobile phone chip", () => {
  it("renders a visible phone tel: link without opening the hamburger", () => {
    renderNav();
    const chip = screen.getByTestId("mobile-phone-chip");
    expect(chip).toHaveAttribute("href", "tel:+12816469546");
    expect(chip).toHaveTextContent(/281.*9546/i);
  });
});
