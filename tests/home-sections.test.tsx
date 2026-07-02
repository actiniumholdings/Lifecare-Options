import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { FinalCTA } from "@/components/home/FinalCTA";

function renderFinalCTA() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FinalCTA />
    </NextIntlClientProvider>,
  );
}

describe("FinalCTA (flagship, navy band)", () => {
  it("FinalCTA primary CTA uses the onDark (white-fill) variant on the navy band", () => {
    renderFinalCTA();
    const refer = screen.getByRole("link", { name: /refer a patient/i });
    // onDark = inverted white button, legible on navy
    expect(refer.className).toContain("bg-white");
    expect(refer.className).toContain("text-navy");
  });

  it("FinalCTA secondary ghost stays white in BOTH rest and hover on the navy band", () => {
    renderFinalCTA();
    const contact = screen.getByRole("link", { name: /contact us/i });
    // Rest: white text on navy. The override must also force hover:text-white so
    // twMerge drops the canonical secondary's hover:text-blue-deep, which would
    // render ~1.4:1 (invisible) on navy.
    expect(contact.className).toContain("text-white");
    expect(contact.className).toContain("hover:text-white");
    expect(contact.className).not.toContain("hover:text-blue-deep");
  });
});
