import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareersTeaser } from "@/components/home/CareersTeaser";

describe("Home CareersTeaser", () => {
  it("recruits for both clinicians and attendants and links to /careers", () => {
    render(<CareersTeaser />);
    expect(screen.getByText(/attendant/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /career|join|explore/i })).toHaveAttribute(
      "href",
      "/careers"
    );
  });
});
