import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

describe("design-system type scale and tokens", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  it("defines the sky-soft section background token", () => {
    expect(css).toMatch(/--color-sky-soft:\s*#EAF2F9/i);
  });

  it("defines the four type-scale utilities", () => {
    for (const u of ["text-display-xl", "text-display", "text-title", "text-caption"]) {
      expect(css).toContain(`@utility ${u}`);
    }
  });

  it("gives bare headings a base size so no h1 can render at body size", () => {
    expect(css).toMatch(/@layer base[\s\S]*h1\s*\{[\s\S]*?font-size/);
  });
});
