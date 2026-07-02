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

  it("has a Refer a Patient CTA anchoring to /refer", () => {
    renderNav();
    const ctas = screen.getAllByRole("link", { name: /refer a patient/i });
    expect(ctas[0]).toHaveAttribute("href", "/refer");
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(
      screen.queryByRole("navigation", { name: /mobile/i })
    ).not.toBeInTheDocument();
    await user.click(toggle);
    expect(
      screen.getByRole("navigation", { name: /mobile/i })
    ).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
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
    // The mobile menu is closed by default — the mobile-only phone link
    // (in the dropdown panel) does not exist yet.
    expect(
      screen.queryByRole("navigation", { name: /mobile/i })
    ).not.toBeInTheDocument();
    const chip = screen.getAllByRole("link", { name: /281.*9546/i })[0];
    expect(chip).toHaveAttribute("href", "tel:+12816469546");
    expect(chip).toHaveTextContent(/281.*9546/i);
  });
});

describe("Nav Services dropdown", () => {
  it("keeps the top-level Services link pointing at /services", () => {
    renderNav();
    const servicesLinks = screen.getAllByRole("link", { name: /^services$/i });
    expect(servicesLinks.some((l) => l.getAttribute("href") === "/services")).toBe(
      true
    );
  });

  it("has a Skilled Home Health link to /services/skilled", () => {
    renderNav();
    const link = screen.getByRole("link", { name: /skilled home health/i });
    expect(link).toHaveAttribute("href", "/services/skilled");
  });

  it("has an Attendant Services link to /services/attendant", () => {
    renderNav();
    const link = screen.getByRole("link", { name: /attendant services/i });
    expect(link).toHaveAttribute("href", "/services/attendant");
  });

  it("has a Remote Patient Monitoring link to /remote-patient-monitoring", () => {
    renderNav();
    const link = screen.getByRole("link", { name: /remote patient monitoring/i });
    expect(link).toHaveAttribute("href", "/remote-patient-monitoring");
  });

  it("exposes the desktop dropdown trigger as a button with aria-expanded", async () => {
    const user = userEvent.setup();
    renderNav();
    const trigger = screen.getByRole("button", { name: /^services$/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the desktop dropdown on Escape", async () => {
    const user = userEvent.setup();
    renderNav();
    const trigger = screen.getByRole("button", { name: /^services$/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
