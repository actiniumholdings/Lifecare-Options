import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the hero, trust sentence, and form section content", () => {
    render(<HomePage />);
    // Hero content
    expect(screen.getByText(/home health · katy, tx/i)).toBeInTheDocument();
    expect(screen.getByText(/medicare-certified skilled nursing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/281.*9546/i).length).toBeGreaterThan(0);
    // Trust sentence credentials
    expect(screen.getAllByText(/medicare-certified/i).length).toBeGreaterThan(0);
    // Form section — "Get in touch." is rendered word-by-word via StaggerWords,
    // so match against the container's full text content instead.
    expect(document.body.textContent).toMatch(/get in touch/i);
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
