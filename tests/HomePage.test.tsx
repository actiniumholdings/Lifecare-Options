import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { HomeContent as HomePage } from "@/app/[locale]/HomeContent";

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <HomePage />
    </NextIntlClientProvider>,
  );
}

describe("HomePage", () => {
  it("renders the hero, trust stats, and form section content", () => {
    renderHome();
    // Hero content
    expect(screen.getByText(/home health · katy, tx/i)).toBeInTheDocument();
    expect(screen.getByText(/medicare-certified skilled nursing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/281.*9546/i).length).toBeGreaterThan(0);
    // Trust stats
    expect(screen.getAllByText(/medicare/i).length).toBeGreaterThan(0);
    // Lead form tabs confirm contact section is present
    expect(screen.getByText(/services inquiry/i)).toBeInTheDocument();
    expect(screen.getByText(/work with us/i)).toBeInTheDocument();
  });

  it("never renders any element with inline style opacity:0 (motion-visibility regression test)", () => {
    const { container } = renderHome();
    const allElements = container.querySelectorAll("*");
    const hiddenElements: string[] = [];
    allElements.forEach((el) => {
      const opacity = (el as HTMLElement).style.opacity;
      if (opacity === "0") {
        hiddenElements.push(el.tagName + " " + el.className.slice(0, 60));
      }
    });
    expect(hiddenElements).toEqual([]);
  });
});
