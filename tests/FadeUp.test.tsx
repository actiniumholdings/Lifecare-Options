import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FadeUp } from "@/components/motion/FadeUp";

describe("FadeUp", () => {
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
});
