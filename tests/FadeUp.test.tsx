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

  it("renders content at opacity 1 even when not yet in view", () => {
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
