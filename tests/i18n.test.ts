import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing", () => {
  it("serves English only while Spanish translations are pending", () => {
    // "es" is intentionally disabled until messages/es.json is actually
    // translated (it is currently an untranslated copy of en.json).
    expect(routing.locales).toEqual(["en"]);
    expect(routing.defaultLocale).toBe("en");
  });
});
