import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock useReducedMotion so individual tests can flip prefers-reduced-motion
// on demand, mirroring tests/use-reduced-motion-safe.test.tsx. FadeUp's
// contract: under prefers-reduced-motion: reduce it renders a plain element
// with content visible (opacity 1, no transform) and no IntersectionObserver
// dependency — see the doc comment on components/motion/FadeUp.tsx.
const mockUseReducedMotion = vi.fn(() => false);
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

import { FadeUp } from "@/components/motion/FadeUp";

describe("FadeUp", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders its children", () => {
    render(
      <FadeUp>
        <h1>Hello</h1>
      </FadeUp>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts an optional delay prop without throwing", () => {
    render(
      <FadeUp delay={200}>
        <p>Delayed</p>
      </FadeUp>
    );
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });

  it("renders content at opacity 1 even when not yet in view (prefers-reduced-motion)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(
      <FadeUp>
        <p>VisibleAlways</p>
      </FadeUp>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const opacity = wrapper.style.opacity;
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
