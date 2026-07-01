import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import ServiceAreaPage from "@/app/[locale]/service-area/page";

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ServiceAreaPage />
    </NextIntlClientProvider>,
  );
}

describe("Service Area page", () => {
  it("renders an h1 with the headline", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeTruthy();
    expect(h1.textContent).toMatch(/Katy/);
  });

  it("renders Harris County in the counties strip", () => {
    renderPage();
    const matches = screen.getAllByText(/Harris County/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders a Fulshear city pill", () => {
    renderPage();
    const matches = screen.getAllByText(/Fulshear/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the ServiceMap figure with accessible name", () => {
    renderPage();
    const map = screen.getByRole("img", { name: /coverage map/i });
    expect(map).toBeTruthy();
  });
});
