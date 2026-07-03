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

  it("represents both service lines: skilled and attendant care", () => {
    renderAbout();
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/attendant|everyday|daily support/i);
    expect(text).toMatch(/skilled|nursing|therapy/i);
  });

  it("still renders exactly one h1", () => {
    renderAbout();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the credentials strip (license, CCN, CHAP)", () => {
    renderAbout();
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/011908/);
    expect(text).toMatch(/747061/);
    expect(text).toMatch(/CHAP/i);
  });

  it("does not reintroduce the old 2008 founding year", () => {
    renderAbout();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/2008/);
  });

  it("does not list payer/program names", () => {
    renderAbout();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/medicaid|star\+plus|private pay|insurance/i);
  });
});
