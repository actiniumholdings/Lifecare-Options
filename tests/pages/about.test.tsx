import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import AboutPage from "@/app/[locale]/about/page";

function renderAbout() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AboutPage />
    </NextIntlClientProvider>,
  );
}

describe("About page", () => {
  it("renders an h1 containing '2008'", () => {
    renderAbout();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/2008/);
  });

  it("renders 'CHAP' in the credentials section", () => {
    renderAbout();
    const chapMatches = screen.getAllByText(/CHAP/i);
    expect(chapMatches.length).toBeGreaterThan(0);
  });

  it("renders '2008' on the page", () => {
    renderAbout();
    const matches = screen.getAllByText(/2008/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
