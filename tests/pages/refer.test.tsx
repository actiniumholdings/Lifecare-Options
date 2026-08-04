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

  it("renders both a clinical/physician referral path and a community/family referral path", () => {
    renderRefer();
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/physician|discharge|hospital|clinician/i);
    expect(text).toMatch(/family|families|community|case manager|anyone/i);
  });

  it("keeps response-time copy hedged, not a guaranteed same/second-day SLA", () => {
    renderRefer();
    const text = document.body.textContent ?? "";
    expect(text).toMatch(/usually within one business day/i);
    expect(text).not.toMatch(/guarantee[ds]?\s+(same|second)[\s-]day/i);
  });

  it("does not name any payer or program", () => {
    renderRefer();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/medicare|medicaid|star\+plus|private pay|insurance/i);
  });
});
