import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaBand } from "@/components/ui/CtaBand";

describe("CtaBand", () => {
  it("renders a level-2 heading and CTA links", () => {
    render(
      <CtaBand
        headline="Ready to bring care home?"
        primary={{ label: "Request info", href: "/contact" }}
        secondary={{ label: "Call (281) 646-9546", href: "tel:+12816469546" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Ready to bring care home?",
    );
    expect(screen.getByRole("link", { name: "Request info" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(
      screen.getByRole("link", { name: /call/i }),
    ).toHaveAttribute("href", "tel:+12816469546");
  });
});
