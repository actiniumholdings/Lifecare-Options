import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { SkipLink } from "@/components/a11y/SkipLink";

function renderSkipLink() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SkipLink />
    </NextIntlClientProvider>
  );
}

describe("SkipLink", () => {
  it("links to the main landmark", () => {
    renderSkipLink();
    const link = screen.getByRole("link", { name: /skip to main/i });
    expect(link).toHaveAttribute("href", "#main");
  });
});
