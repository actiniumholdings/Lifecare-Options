import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Stagger no longer exports StaggerItem — it renders `<FadeUp>` children
// directly (see the doc comment on components/motion/Stagger.tsx). Mock
// useReducedMotion so individual tests can flip prefers-reduced-motion on
// demand, mirroring tests/use-reduced-motion-safe.test.tsx.
const mockUseReducedMotion = vi.fn(() => false);
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

import { Stagger } from "@/components/motion/Stagger";
import { FadeUp } from "@/components/motion/FadeUp";

describe("Stagger", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("renders its children", () => {
    render(
      <Stagger>
        <FadeUp>One</FadeUp>
        <FadeUp>Two</FadeUp>
      </Stagger>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("renders items at opacity 1 even when not yet in view (prefers-reduced-motion)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(
      <Stagger>
        <FadeUp>Always</FadeUp>
      </Stagger>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const opacity = wrapper.style.opacity;
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
