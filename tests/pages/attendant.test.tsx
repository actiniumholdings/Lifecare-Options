import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AttendantContent } from "@/app/[locale]/services/attendant/AttendantContent";

function renderAttendant() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AttendantContent />
    </NextIntlClientProvider>,
  );
}

describe("Attendant services page", () => {
  it("renders exactly one h1", () => {
    renderAttendant();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the task grid", () => {
    renderAttendant();
    expect(screen.getByText(/bathing/i)).toBeInTheDocument();
    expect(screen.getByText(/meal preparation/i)).toBeInTheDocument();
    expect(screen.getByText(/light housekeeping/i)).toBeInTheDocument();
  });

  it("renders a what-to-expect section", () => {
    renderAttendant();
    expect(
      screen.getByRole("heading", { name: /what to expect/i }),
    ).toBeInTheDocument();
  });

  it("renders a careers cross-link to /careers", () => {
    renderAttendant();
    const careersLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/careers");
    expect(careersLink).toBeDefined();
  });

  it("contains no payer, program, insurance, guarantee, or eligibility content", () => {
    const { container } = renderAttendant();
    expect(container.textContent).not.toMatch(
      /medicare|medicaid|star\+plus|\bphc\b|\bcas\b|\bfc\b|private pay|insurance|commercial plan|guarantee|will qualify|approved|eligib/i,
    );
  });
});
