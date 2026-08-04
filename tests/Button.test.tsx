import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders primary variant by default with blue-deep background", () => {
    render(<Button>Request info</Button>);
    const btn = screen.getByRole("button", { name: /request info/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/bg-blue-deep/);
  });

  it("secondary variant is an outlined button, not amber", () => {
    render(<Button variant="secondary">Call</Button>);
    const btn = screen.getByRole("button", { name: "Call" });
    expect(btn.className).toContain("border");
    expect(btn.className).toContain("bg-white");
    expect(btn.className).not.toContain("amber");
  });

  it("onDark variant renders an inverted white button for navy bands", () => {
    render(<Button variant="onDark">Refer a Patient</Button>);
    const btn = screen.getByRole("button", { name: "Refer a Patient" });
    expect(btn.className).toContain("bg-white");
    expect(btn.className).toContain("text-navy");
  });

  it("renders as an <a> when href is provided", () => {
    render(<Button href="#contact">Jump</Button>);
    const link = screen.getByRole("link", { name: /jump/i });
    expect(link).toHaveAttribute("href", "#contact");
  });

  it("preserves type='submit' when wrapping with motion (regression guard)", () => {
    render(<Button type="submit">Send</Button>);
    const btn = screen.getByRole("button", { name: /send/i }) as HTMLButtonElement;
    expect(btn.type).toBe("submit");
  });
});
