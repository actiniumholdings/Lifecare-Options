import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { HomeContent as Home } from "@/app/[locale]/HomeContent";

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Home />
    </NextIntlClientProvider>,
  );
}

describe("Home page", () => {
  it("shows the hero headline", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent(/felt at home/i);
  });

  it("shows the hero eyebrow from messages", () => {
    renderHome();
    expect(screen.getByText(/home health · katy, tx/i)).toBeInTheDocument();
  });

  it("shows trust stats", () => {
    renderHome();
    // Multiple "Medicare" matches expected (intro text, stat, form option)
    expect(screen.getAllByText(/medicare/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/chap/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/24\/7/i).length).toBeGreaterThan(0);
  });

  it("renders the services list", () => {
    renderHome();
    // "Skilled Nursing" appears in both ServicesList and LeadForm options
    expect(screen.getAllByText(/skilled nursing/i).length).toBeGreaterThan(0);
  });

  it("renders the lead form tabs", () => {
    renderHome();
    expect(screen.getByText(/services inquiry/i)).toBeInTheDocument();
    expect(screen.getByText(/work with us/i)).toBeInTheDocument();
  });

  it("has a link to #contact for the primary CTA", () => {
    renderHome();
    const links = screen.getAllByRole("link");
    const contactLink = links.find(
      (l) => l.getAttribute("href") === "#contact",
    );
    expect(contactLink).toBeDefined();
  });
});
