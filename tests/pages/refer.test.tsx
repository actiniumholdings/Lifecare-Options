import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ReferContent as ReferPage } from "@/app/[locale]/refer/ReferContent";

function renderRefer() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ReferPage />
    </NextIntlClientProvider>,
  );
}

describe("Refer page", () => {
  it("renders an h1 containing 'Refer'", () => {
    renderRefer();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/refer/i);
  });

  it("renders the fax number", () => {
    renderRefer();
    const matches = screen.getAllByText(/646-9757/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders a 'what happens next' step about contacting within one business day", () => {
    renderRefer();
    const matches = screen.getAllByText(/business day/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
