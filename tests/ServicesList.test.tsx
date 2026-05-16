import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesList } from "@/components/ServicesList";

describe("ServicesList", () => {
  it("renders the 'Now offering' RPM ribbon at the top", () => {
    render(<ServicesList />);
    expect(screen.getByText(/now offering/i)).toBeInTheDocument();
    expect(screen.getByText(/remote patient monitoring/i)).toBeInTheDocument();
  });

  it("renders the six standard disciplines with their descriptions", () => {
    render(<ServicesList />);
    const standardNames = [
      "Skilled Nursing",
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
      "Medical Social Work",
      "Home Health Aide",
    ];
    standardNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders numerals 01 through 06 for the standard disciplines", () => {
    render(<ServicesList />);
    for (let i = 1; i <= 6; i++) {
      const numeral = String(i).padStart(2, "0");
      expect(screen.getByText(numeral)).toBeInTheDocument();
    }
  });
});
