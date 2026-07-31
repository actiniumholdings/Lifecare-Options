import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the hero, trust ticker, and form section content", () => {
    const { container } = render(<HomePage />);
    // Hero content
    expect(screen.getByText(/home health · katy, tx/i)).toBeInTheDocument();
    expect(
      screen.getByText(/medicare-certified skilled nursing/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/281.*9546/i).length).toBeGreaterThan(0);
    // Trust ticker credentials
    expect(screen.getAllByText(/medicare-certified/i).length).toBeGreaterThan(0);
    // Contact section
    expect(container.textContent).toMatch(/get in touch/i);
    expect(container.textContent).toMatch(/ready to bring/i);
  });

  // The hero stat is derived from foundedYear, not hardcoded — the design kit
  // shipped a literal "18" that would silently go stale each January.
  it("derives the years-serving stat from foundedYear", () => {
    const { container } = render(<HomePage />);
    const expected = String(new Date().getFullYear() - 2008);
    expect(container.textContent).toContain(expected);
    expect(container.textContent).toMatch(/years serving katy/i);
  });

  it("never renders any element with inline style opacity:0 (motion-visibility regression test)", () => {
    const { container } = render(<HomePage />);
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
