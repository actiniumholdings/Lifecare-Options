import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PillarCard } from "@/components/ui/PillarCard";

const props = {
  eyebrow: "Medicare-certified",
  title: "Skilled Home Health",
  description: "Licensed clinicians bring hospital-grade skill into the home.",
  services: ["Skilled Nursing", "Physical Therapy"],
  payerHint: "Medicare · Medicare Advantage · commercial plans",
  href: "/services/skilled",
  cta: "Explore skilled care",
};

describe("PillarCard", () => {
  it("renders title at title scale with all service items", () => {
    render(<PillarCard {...props} />);
    const heading = screen.getByRole("heading", { name: "Skilled Home Health" });
    expect(heading.className).toContain("text-title");
    for (const s of props.services) expect(screen.getByText(s)).toBeInTheDocument();
  });

  it("links to the pillar page and shows the payer hint", () => {
    render(<PillarCard {...props} />);
    expect(screen.getByRole("link", { name: /explore skilled care/i })).toHaveAttribute(
      "href",
      "/services/skilled"
    );
    expect(screen.getByText(props.payerHint)).toBeInTheDocument();
  });
});
