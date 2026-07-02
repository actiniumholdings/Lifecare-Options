import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/ui/Hero";

const baseProps = {
  eyebrow: "Our Services",
  headline: "Skilled care, brought home.",
  intro: "Our team comes to you.",
  photoSrc: "/images/hero-care.jpg",
  photoAlt: "A nurse checks a patient's blood pressure at home.",
};

describe("Hero", () => {
  it("renders the headline at display scale", () => {
    const { container } = render(<Hero {...baseProps} />);
    const h1 = container.querySelector("h1")!;
    expect(h1.textContent).toBe("Skilled care, brought home.");
    expect(h1.className).toContain("text-display-xl");
  });

  it("always renders the photo — no empty gradient panel", () => {
    render(<Hero {...baseProps} />);
    const img = screen.getByRole("img", {
      name: "A nurse checks a patient's blood pressure at home.",
    });
    expect(img).toBeInTheDocument();
  });

  it("sits on the sky-soft band, not legacy mist", () => {
    const { container } = render(<Hero {...baseProps} />);
    expect(container.querySelector("section")!.className).toContain("bg-sky-soft");
    expect(container.querySelector("section")!.className).not.toContain("mist");
  });
});
