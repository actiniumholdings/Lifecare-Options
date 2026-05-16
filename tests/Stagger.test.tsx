import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

describe("Stagger", () => {
  it("renders its children", () => {
    render(
      <Stagger>
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
      </Stagger>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("renders items at opacity 1 even when not yet in view", () => {
    const { container } = render(
      <Stagger>
        <StaggerItem>Always</StaggerItem>
      </Stagger>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const opacity = wrapper.style.opacity;
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
