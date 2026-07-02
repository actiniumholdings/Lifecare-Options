import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TrustSentence } from "@/components/TrustSentence";

describe("TrustSentence", () => {
  it("renders the credentials eyebrow", () => {
    render(<TrustSentence />);
    expect(screen.getByText(/credentials/i)).toBeInTheDocument();
  });

  it("renders all four credibility claims as text content", () => {
    render(<TrustSentence />);
    expect(screen.getByText(/medicare-certified/i)).toBeInTheDocument();
    expect(screen.getByText(/CHAP-accredited/i)).toBeInTheDocument();
    expect(screen.getByText(/katy/i)).toBeInTheDocument();
    expect(screen.getByText(/2012/i)).toBeInTheDocument();
  });
});
