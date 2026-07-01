import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceMap } from "@/components/area/ServiceMap";

describe("ServiceMap", () => {
  it("renders an accessible figure naming both counties", () => {
    render(<ServiceMap />);
    const fig = screen.getByRole("img", { name: /coverage map/i });
    expect(fig).toBeInTheDocument();
    expect(screen.getByText("Harris County")).toBeInTheDocument();
    expect(screen.getByText("Fort Bend County")).toBeInTheDocument();
  });
});
