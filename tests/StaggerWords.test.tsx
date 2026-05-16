import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { StaggerWords } from "@/components/motion/StaggerWords";

describe("StaggerWords", () => {
  it("renders the full text as readable content", () => {
    render(<StaggerWords text="Quality care, felt at home." />);
    // textContent collapses the word spans + spaces back to the original string
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Quality care, felt at home.");
  });

  it("renders an h2 when as='h2'", () => {
    render(<StaggerWords as="h2" text="Get in touch" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("preserves line breaks when given an array of strings", () => {
    const { container } = render(
      <StaggerWords text={["Quality care,", "felt at home."]} />,
    );
    expect(container.querySelector("br")).not.toBeNull();
    // Both lines' words are present
    expect(container.textContent).toContain("Quality");
    expect(container.textContent).toContain("felt");
  });

  it("forwards className to the rendered element", () => {
    render(
      <StaggerWords as="h2" text="Hello world" className="text-lg custom" />,
    );
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveClass("text-lg", "custom");
  });
});
