import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

describe("theme utility classes (smoke)", () => {
  it("renders elements with blue-deep and amber utility classes", () => {
    const { container } = render(
      <div className="bg-blue-deep text-amber">theme smoke</div>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("bg-blue-deep");
    expect(el.className).toContain("text-amber");
  });
});
