import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import ServicesPage from "@/app/[locale]/services/page";

function renderServices() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ServicesPage />
    </NextIntlClientProvider>,
  );
}

describe("Services page sections", () => {
  it("renders h1 containing 'Skilled care, brought home'", () => {
    renderServices();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /skilled care, brought home/i,
    );
  });

  it("renders a service card for Skilled Nursing", () => {
    renderServices();
    expect(screen.getByText("Skilled Nursing")).toBeInTheDocument();
  });

  it("renders a specialty chip for Wound care", () => {
    renderServices();
    expect(screen.getByText("Wound care")).toBeInTheDocument();
  });
});
