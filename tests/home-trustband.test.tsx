import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBand } from "@/components/home/TrustBand";

describe("Home TrustBand", () => {
  it("keeps the 14-years stat and names both service lines in the framing", () => {
    render(<TrustBand />);
    expect(screen.getByText(/years serving katy/i)).toBeInTheDocument();
    // framing acknowledges skilled + attendant, not skilled-only
    expect(screen.getByText(/skilled home health and attendant/i)).toBeInTheDocument();
  });
});
