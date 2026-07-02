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
import { generateMetadata as skilledMeta } from "@/app/[locale]/services/skilled/page";
import { generateMetadata as attendantMeta } from "@/app/[locale]/services/attendant/page";
import { generateMetadata as aboutMeta } from "@/app/[locale]/about/page";
import { generateMetadata as serviceAreaMeta } from "@/app/[locale]/service-area/page";
import { generateMetadata as careersMeta } from "@/app/[locale]/careers/page";
import { generateMetadata as referMeta } from "@/app/[locale]/refer/page";
import { generateMetadata as contactMeta } from "@/app/[locale]/contact/page";
import { generateMetadata as rpmMeta } from "@/app/[locale]/remote-patient-monitoring/page";
import { generateMetadata as accessibilityMeta } from "@/app/[locale]/accessibility/page";

// Helper: es meta keys — assert every namespace has meta in es.json too
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

// ---------- services/skilled ----------
describe("skilled metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await skilledMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services/skilled`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await skilledMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("has en + es hreflang alternates", async () => {
    const m = await skilledMeta({ params: makeParams("en") });
    expect(m.alternates?.languages?.en).toBe(`${SITE_URL}/services/skilled`);
    expect(m.alternates?.languages?.es).toBe(`${SITE_URL}/es/services/skilled`);
  });
  it("es.json has skilled meta keys", () => {
    expect(esMessages.skilled.meta.title).toBeTruthy();
    expect(esMessages.skilled.meta.description).toBeTruthy();
  });
});

// ---------- services/attendant ----------
describe("attendant metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await attendantMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services/attendant`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await attendantMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("has en + es hreflang alternates", async () => {
    const m = await attendantMeta({ params: makeParams("en") });
    expect(m.alternates?.languages?.en).toBe(`${SITE_URL}/services/attendant`);
    expect(m.alternates?.languages?.es).toBe(`${SITE_URL}/es/services/attendant`);
  });
  it("es.json has attendant meta keys", () => {
    expect(esMessages.attendant.meta.title).toBeTruthy();
    expect(esMessages.attendant.meta.description).toBeTruthy();
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

// ---------- service-area ----------
describe("serviceArea metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await serviceAreaMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/service-area`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await serviceAreaMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has serviceArea meta keys", () => {
    expect(esMessages.serviceArea.meta.title).toBeTruthy();
    expect(esMessages.serviceArea.meta.description).toBeTruthy();
  });
});

// ---------- careers ----------
describe("careers metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await careersMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/careers`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await careersMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has careers meta keys", () => {
    expect(esMessages.careers.meta.title).toBeTruthy();
    expect(esMessages.careers.meta.description).toBeTruthy();
  });
});

// ---------- refer ----------
describe("refer metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await referMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/refer`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await referMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has refer meta keys", () => {
    expect(esMessages.refer.meta.title).toBeTruthy();
    expect(esMessages.refer.meta.description).toBeTruthy();
  });
});

// ---------- contact ----------
describe("contact metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await contactMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/contact`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await contactMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has contact meta keys", () => {
    expect(esMessages.contact.meta.title).toBeTruthy();
    expect(esMessages.contact.meta.description).toBeTruthy();
  });
});

// ---------- rpm ----------
describe("rpm metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await rpmMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/remote-patient-monitoring`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await rpmMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has rpm meta keys", () => {
    expect(esMessages.rpm.meta.title).toBeTruthy();
    expect(esMessages.rpm.meta.description).toBeTruthy();
  });
});

// ---------- accessibility ----------
describe("accessibility metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await accessibilityMeta({ params: makeParams("en") });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/accessibility`);
  });
  it("returns a description within 155 chars", async () => {
    const m = await accessibilityMeta({ params: makeParams("en") });
    expect((m.description as string).length).toBeLessThanOrEqual(155);
  });
  it("es.json has accessibility meta keys", () => {
    expect(esMessages.accessibility.meta.title).toBeTruthy();
    expect(esMessages.accessibility.meta.description).toBeTruthy();
  });
});
