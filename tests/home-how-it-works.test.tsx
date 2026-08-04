import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "@/components/home/HowItWorks";

describe("Home HowItWorks", () => {
  it("renders three ordered steps via the StepList primitive", () => {
    render(<HowItWorks />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(/we listen/i)).toBeInTheDocument();
  });
});
