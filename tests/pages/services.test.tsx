import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ServicesContent as ServicesPage } from "@/app/[locale]/services/ServicesContent";

function renderServices() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ServicesPage />
    </NextIntlClientProvider>,
  );
}

describe("Services hub page", () => {
  it("renders a Skilled Home Health pillar heading linking to /services/skilled", () => {
    renderServices();
    const heading = screen.getByRole("heading", { name: /skilled home health/i });
    expect(heading).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /explore skilled care/i });
    expect(link).toHaveAttribute("href", "/services/skilled");
  });

  it("renders a Provider Attendant Services pillar heading linking to /services/attendant", () => {
    renderServices();
    const heading = screen.getByRole("heading", { name: /provider attendant services/i });
    expect(heading).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /explore attendant care/i });
    expect(link).toHaveAttribute("href", "/services/attendant");
  });

  it("renders a 'not sure which you need?' explainer strip", () => {
    renderServices();
    expect(screen.getByText(/not sure which you need/i)).toBeInTheDocument();
    expect(screen.getByText(/recovering from an illness, surgery/i)).toBeInTheDocument();
    expect(screen.getByText(/help with everyday tasks/i)).toBeInTheDocument();
  });

  it("contains no payer or program names anywhere on the page", () => {
    const { container } = renderServices();
    expect(container.textContent).not.toMatch(
      /medicaid|star\+plus|phc|\bcas\b|private pay|insurance|commercial plan/i,
    );
    expect(container.textContent).not.toMatch(/medicare advantage/i);
  });
});
