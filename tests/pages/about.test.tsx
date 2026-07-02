import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AboutContent as AboutPage } from "@/app/[locale]/about/AboutContent";

function renderAbout() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AboutPage />
    </NextIntlClientProvider>,
  );
}

describe("About page", () => {
  it("renders an h1 containing '2012'", () => {
    renderAbout();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/2012/);
  });

  it("renders 'CHAP' in the credentials section", () => {
    renderAbout();
    const chapMatches = screen.getAllByText(/CHAP/i);
    expect(chapMatches.length).toBeGreaterThan(0);
  });

  it("renders '2012' on the page", () => {
    renderAbout();
    const matches = screen.getAllByText(/2012/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
