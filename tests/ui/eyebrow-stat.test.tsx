import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";

describe("Eyebrow", () => {
  it("renders its label uppercase-styled in care-blue", () => {
    const { container } = render(<Eyebrow>Our Services</Eyebrow>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("text-care-blue");
    expect(el.className).toContain("uppercase");
    expect(screen.getByText("Our Services")).toBeInTheDocument();
  });
});

describe("Stat", () => {
  it("renders value and label", () => {
    render(<Stat value="2008" label="Serving Katy since" />);
    expect(screen.getByText("2008")).toBeInTheDocument();
    expect(screen.getByText("Serving Katy since")).toBeInTheDocument();
  });
});
