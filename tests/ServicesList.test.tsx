import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesList } from "@/components/ServicesList";

describe("ServicesList", () => {
  it("renders a service name (Skilled Nursing)", () => {
    render(<ServicesList />);
    expect(screen.getByText("Skilled Nursing")).toBeInTheDocument();
  });

  it("renders amber icon tiles with bg-amber/15", () => {
    const { container } = render(<ServicesList />);
    const amberTiles = container.querySelectorAll(".bg-amber\\/15");
    expect(amberTiles.length).toBeGreaterThan(0);
  });

  it("renders all seven service names", () => {
    render(<ServicesList />);
    const allNames = [
      "Skilled Nursing",
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
      "Medical Social Work",
      "Home Health Aide",
      "Remote Patient Monitoring",
    ];
    allNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders 'Learn more' affordance for each card", () => {
    render(<ServicesList />);
    const learnMoreLinks = screen.getAllByText(/learn more/i);
    expect(learnMoreLinks.length).toBe(7);
  });
});
