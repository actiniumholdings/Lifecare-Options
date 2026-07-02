import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

describe("Home page sections", () => {
  it("renders h1 containing 'felt at home'", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /felt at home/i,
    );
  });

  it("renders the How It Works h2", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { name: /care at home starts with a conversation/i }),
    ).toBeInTheDocument();
  });

  it("renders a city pill for Fulshear", () => {
    renderHome();
    // 'Fulshear' only appears in the service-area pill grid, not in hero or trust
    const citiesList = screen.getByRole("list", { name: /cities served/i });
    expect(within(citiesList).getByText("Fulshear")).toBeInTheDocument();
  });

  it("renders the testimonials empty-state text", () => {
    renderHome();
    expect(
      screen.getByText(/reviews from families are coming soon/i),
    ).toBeInTheDocument();
  });
});
