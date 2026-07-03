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

  it("renders a clinical-roles section", () => {
    renderCareers();
    const heading = screen.getByRole("heading", { name: /clinical roles/i });
    expect(heading.closest("section")).toHaveAttribute("id", "clinical");
  });

  it("renders an attendant-roles section", () => {
    renderCareers();
    const heading = screen.getByRole("heading", { name: /attendant roles/i });
    expect(heading.closest("section")).toHaveAttribute("id", "attendant");
  });

  it("mentions 'attendant' on the page", () => {
    renderCareers();
    expect(screen.getAllByText(/attendant/i).length).toBeGreaterThan(0);
  });

  it("renders an anchor nav linking to both #clinical and #attendant", () => {
    const { container } = renderCareers();
    expect(container.querySelector('a[href="#clinical"]')).not.toBeNull();
    expect(container.querySelector('a[href="#attendant"]')).not.toBeNull();
  });

  it("keeps the application CTA targeting #apply", () => {
    const { container } = renderCareers();
    expect(container.querySelector('a[href="#apply"]')).not.toBeNull();
    expect(container.querySelector('section#apply')).not.toBeNull();
  });

  it("makes no payer/program-name claims in the page copy", () => {
    // Scoped to page copy, excluding the shared LeadForm's pre-existing
    // "Insurance" intake field (Medicare/Medicaid/Private options), which is
    // a sitewide form widget out of this page's content scope.
    const { container } = renderCareers();
    const clone = container.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("form").forEach((form) => form.remove());
    expect(clone.textContent).not.toMatch(
      /medicare|medicaid|star\+plus|private pay|insurance/i,
    );
  });
});
