import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

describe("Stagger", () => {
  it("renders all StaggerItem children", () => {
    render(
      <Stagger>
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
        <StaggerItem>Three</StaggerItem>
      </Stagger>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("forwards an optional className to the parent wrapper", () => {
    const { container } = render(
      <Stagger className="custom-grid">
        <StaggerItem>A</StaggerItem>
      </Stagger>
    );
    expect(container.firstChild).toHaveClass("custom-grid");
  });
});
