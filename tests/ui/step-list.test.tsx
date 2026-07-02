import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepList } from "@/components/ui/StepList";

const steps = [
  { title: "We listen", body: "A care coordinator learns the situation." },
  { title: "We coordinate", body: "We verify coverage and arrange an in-home assessment." },
  { title: "Care begins at home", body: "A licensed professional starts a personalized plan." },
];

describe("StepList", () => {
  it("renders an ordered list with numbered steps", () => {
    render(<StepList steps={steps} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]?.textContent).toContain("1");
    expect(items[0]?.textContent).toContain("We listen");
    expect(items[2]?.textContent).toContain("Care begins at home");
  });

  it("dark tone switches text to white", () => {
    render(<StepList steps={steps} tone="dark" />);
    const heading = screen.getByText("We listen");
    expect(heading.className).toContain("text-white");
  });
});
