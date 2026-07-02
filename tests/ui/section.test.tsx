import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/ui/Section";

describe("Section", () => {
  it("renders children inside a section landmark", () => {
    render(<Section id="why"><p>hello</p></Section>);
    const el = document.getElementById("why");
    expect(el?.tagName).toBe("SECTION");
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies the dark tone background", () => {
    const { container } = render(<Section tone="dark">x</Section>);
    expect(container.querySelector("section")?.className).toContain("bg-navy");
  });

  it("applies the sky tone background", () => {
    const { container } = render(<Section tone="sky">x</Section>);
    expect(container.querySelector("section")?.className).toContain("bg-sky-soft");
  });
});
