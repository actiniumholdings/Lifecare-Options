import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/a11y/SkipLink";

describe("SkipLink", () => {
  it("links to the main landmark", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main/i });
    expect(link).toHaveAttribute("href", "#main");
  });
});
