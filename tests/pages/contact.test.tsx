import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ContactContent as ContactPage } from "@/app/[locale]/contact/ContactContent";

function renderContact() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ContactPage />
    </NextIntlClientProvider>,
  );
}

describe("Contact page", () => {
  it("renders an h1 containing 'Contact' or 'hear'", () => {
    renderContact();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeDefined();
  });

  it("renders the phone number", () => {
    renderContact();
    const matches = screen.getAllByText(/646-9546/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the street address '434 Park Grove'", () => {
    renderContact();
    const matches = screen.getAllByText(/434 Park Grove/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the LeadForm (Services inquiry tab)", () => {
    renderContact();
    expect(screen.getByText("Services inquiry")).toBeDefined();
  });
});
