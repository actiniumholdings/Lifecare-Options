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

  it("sits on the full-bleed navy band, not a legacy light card", () => {
    const { container } = render(<Hero {...baseProps} />);
    const section = container.querySelector("section")!;
    // Full-bleed photographic hero on navy (mirrors Central's interior hero).
    expect(section.className).toContain("bg-navy-deep");
    expect(section.className).not.toContain("bg-sky-soft");
    expect(section.className).not.toContain("mist");
  });

  it("renders the primary CTA as a link with the correct href", () => {
    render(<Hero {...baseProps} primaryCta={{ label: "Refer a Patient", href: "/refer" }} />);
    const link = screen.getByRole("link", { name: /refer a patient/i });
    expect(link).toHaveAttribute("href", "/refer");
  });

  it("renders badge labels", () => {
    render(<Hero {...baseProps} badges={[{ label: "Since 2008" }]} />);
    expect(screen.getByText("Since 2008")).toBeInTheDocument();
  });
});
