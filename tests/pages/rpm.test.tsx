import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { RpmContent as RpmPage } from "@/app/[locale]/remote-patient-monitoring/RpmContent";

function renderRpm() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RpmPage />
    </NextIntlClientProvider>,
  );
}

describe("Remote Patient Monitoring page", () => {
  it("renders an h1 with the RPM headline", () => {
    renderRpm();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /daily check-ins/i,
    );
  });

  it("renders the 'New' badge in the hero eyebrow", () => {
    renderRpm();
    expect(screen.getByText(/^New$/i)).toBeDefined();
  });

  it("renders at least one advantage card", () => {
    renderRpm();
    expect(screen.getByText(/catch changes early/i)).toBeDefined();
  });

  it("coverage copy names no payer program and contains a hedge word ('verify' or 'varies')", () => {
    renderRpm();
    const coverageEl = screen.getByText(/coverage varies by plan/i);
    expect(coverageEl.textContent).toMatch(/verify|varies/i);
    expect(coverageEl.textContent).not.toMatch(/medicare|medicaid/i);
  });
});
