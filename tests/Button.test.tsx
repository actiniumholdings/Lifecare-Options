import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders primary variant by default with care-blue background", () => {
    render(<Button>Request info</Button>);
    const btn = screen.getByRole("button", { name: /request info/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/bg-care-blue/);
  });

  it("renders secondary variant as outlined", () => {
    render(<Button variant="secondary">Call</Button>);
    expect(screen.getByRole("button").className).toMatch(/border/);
  });

  it("renders as an <a> when href is provided", () => {
    render(<Button href="#contact">Jump</Button>);
    const link = screen.getByRole("link", { name: /jump/i });
    expect(link).toHaveAttribute("href", "#contact");
  });
});
