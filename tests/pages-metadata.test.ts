import { describe, expect, it, vi } from "vitest";
import { SITE_URL } from "@/lib/metadata";

// Mock next-intl/server so getTranslations works in vitest/jsdom without a request context.
vi.mock("next-intl/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl/server")>();
  const messages = (await import("@/messages/en.json")).default;
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTranslations: async ({ namespace, locale }: { namespace: any; locale: string }) => {
      const { createTranslator } = await import("next-intl");
      return createTranslator({ locale, messages, namespace });
    },
  };
});

// ---------- imports (after mock) ----------
import { generateMetadata as homeMeta } from "@/app/[locale]/page";
import { generateMetadata as servicesMeta } from "@/app/[locale]/services/page";
import { generateMetadata as aboutMeta } from "@/app/[locale]/about/page";
// Remaining pages (service-area, careers, refer, contact, rpm, accessibility) are
// converted in subsequent batches. Their generateMetadata imports are added then.

// Helper: es meta keys — assert parity in es.json
import esMessages from "@/messages/es.json";

const makeParams = (locale: string) => Promise.resolve({ locale });

// ---------- home ----------
describe("home metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await homeMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect((m.title as string).length).toBeLessThanOrEqual(60);
    expect(m.alternates?.canonical).toBe(SITE_URL);
  });
  it("returns a description within 155 chars", async () => {
    const m = await homeMeta({ params: makeParams("en") });
    expect(typeof m.description).toBe("string");
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has home meta keys", () => {
    expect(esMessages.home.meta.title).toBeTruthy();
    expect(esMessages.home.meta.description).toBeTruthy();
  });
});

// ---------- services ----------
describe("services metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await servicesMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await servicesMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has services meta keys", () => {
    expect(esMessages.services.meta.title).toBeTruthy();
    expect(esMessages.services.meta.description).toBeTruthy();
  });
});

// ---------- about ----------
describe("about metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await aboutMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/about`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await aboutMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has about meta keys", () => {
    expect(esMessages.about.meta.title).toBeTruthy();
    expect(esMessages.about.meta.description).toBeTruthy();
  });
});
