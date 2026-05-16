import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HoverLift } from "@/components/motion/HoverLift";

describe("HoverLift", () => {
  it("renders its children", () => {
    render(
      <HoverLift>
        <article>Card content</article>
      </HoverLift>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("forwards className to the wrapper", () => {
    const { container } = render(
      <HoverLift className="wrap-me">
        <span>X</span>
      </HoverLift>
    );
    expect(container.firstChild).toHaveClass("wrap-me");
  });
});
