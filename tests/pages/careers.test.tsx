import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { CareersContent as CareersPage } from "@/app/[locale]/careers/CareersContent";

function renderCareers() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CareersPage />
    </NextIntlClientProvider>,
  );
}

describe("Careers page", () => {
  it("renders an h1 with the careers headline", () => {
    renderCareers();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /care for people/i,
    );
  });

  it("renders the open-roles empty-state text", () => {
    renderCareers();
    expect(
      screen.getByText(/not listing specific roles/i),
    ).toBeDefined();
  });

  it("renders the LeadForm with a 'Work with us' tab", () => {
    renderCareers();
    expect(screen.getByRole("tab", { name: /work with us/i })).toBeDefined();
  });
});
