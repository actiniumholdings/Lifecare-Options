import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesGrid } from "@/components/ServicesGrid";
import { services } from "@/lib/site-config";

describe("ServicesGrid", () => {
  it("renders every service from site-config", () => {
    render(<ServicesGrid />);
    for (const service of services) {
      expect(screen.getByText(service.name)).toBeInTheDocument();
    }
  });

  // The announcement bar advertises Remote Patient Monitoring, so the services
  // section has to actually list it — the design kit's six-service grid dropped
  // it and would have left the site advertising a service it never mentions.
  it("features Remote Patient Monitoring rather than omitting it", () => {
    const { container } = render(<ServicesGrid />);
    expect(screen.getByText("Remote Patient Monitoring")).toBeInTheDocument();
    expect(container.textContent).toMatch(/now offering/i);
  });

  it("numbers the six standard disciplines", () => {
    const { container } = render(<ServicesGrid />);
    expect(container.textContent).toContain("01");
    expect(container.textContent).toContain("06");
    expect(container.textContent).not.toContain("07");
  });
});
