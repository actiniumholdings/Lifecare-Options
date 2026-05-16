import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TrustBadge } from "@/components/TrustBadge";

describe("TrustBadge", () => {
  it("renders its label", () => {
    render(<TrustBadge>Medicare-certified</TrustBadge>);
    expect(screen.getByText(/medicare-certified/i)).toBeInTheDocument();
  });

  it("renders the decorative checkmark with aria-hidden", () => {
    const { container } = render(<TrustBadge>X</TrustBadge>);
    const check = container.querySelector('[aria-hidden="true"]');
    expect(check).not.toBeNull();
    expect(check?.textContent).toBe("✓");
  });
});
