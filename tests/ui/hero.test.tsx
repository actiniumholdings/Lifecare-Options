import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/ui/Hero";

describe("Hero", () => {
  it("renders the headline as an h1 and the eyebrow", () => {
    render(<Hero eyebrow="Home Health · Katy, TX" headline="Quality care, felt at home." />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Quality care, felt at home.");
    expect(screen.getByText("Home Health · Katy, TX")).toBeInTheDocument();
  });

  it("renders CTAs as links when provided", () => {
    render(
      <Hero
        eyebrow="e"
        headline="h"
        primaryCta={{ label: "Request info", href: "#contact" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Request info" })).toHaveAttribute("href", "#contact");
  });

  it("renders an image with alt text when photoSrc is provided", () => {
    render(
      <Hero
        eyebrow="e"
        headline="h"
        photoSrc="/x.jpg"
        photoAlt="Caregiver helping a patient"
      />,
    );
    expect(screen.getByAltText("Caregiver helping a patient")).toBeInTheDocument();
  });

  it("renders badge labels when badges are provided", () => {
    render(
      <Hero
        eyebrow="e"
        headline="h"
        badges={[{ label: "Since 2008" }, { label: "Medicare Certified" }]}
      />,
    );
    expect(screen.getByText("Since 2008")).toBeInTheDocument();
    expect(screen.getByText("Medicare Certified")).toBeInTheDocument();
  });
});
