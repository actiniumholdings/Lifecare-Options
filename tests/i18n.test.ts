import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing", () => {
  it("supports English and Spanish with English default", () => {
    expect(routing.locales).toEqual(["en", "es"]);
    expect(routing.defaultLocale).toBe("en");
  });
});
