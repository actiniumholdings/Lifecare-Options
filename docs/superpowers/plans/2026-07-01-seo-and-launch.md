# Lifecare Full Site — Plan 3: SEO & Launch-Readiness

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Lifecare site launch-ready: full technical SEO (per-page metadata + canonical + hreflang, `MedicalBusiness` JSON-LD, sitemap, robots, a branded OG image), security headers with a CSP that permits the contact map, and an accessibility pass that brings the primary CTA to WCAG AA contrast.

**Architecture:** Continue on `feat/full-site` (from Plan 2 HEAD `dce04c3`). Mirror the sister site `central-home-health`'s proven SEO wiring (`lib/metadata.ts`, `lib/seo.ts`, `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `next.config.ts` headers), adapted to Lifecare's single-line data and identity. All SEO strings live in `next-intl` messages (en + es parity) or `site-config`; JSON-LD/sitemap read real data from `site-config`.

**Tech Stack:** Next.js 16.2.x (App Router, `[locale]`), next-intl v4, Tailwind v4, `next/og` `ImageResponse`. (Deployment itself — Vercel project, Resend key, DNS cutover — is phase-0 HANDOFF Task 19, done by Clint, out of scope here.)

## Global Constraints

_Every task's requirements implicitly include this section._

- **Worktree:** `~/Documents/Claude/Projects/lifecare-full-site` (branch `feat/full-site`, continues from `dce04c3`). **cd into it at the start of every shell command** (iCloud repo). Before any `tsc`/`build`, delete iCloud conflict copies: `find . -path ./node_modules -prune -o \( -name "* [0-9].ts" -o -name "* [0-9].tsx" -o -name "* [0-9].json" \) -print -delete`. If the dev server ever fails with a Turbopack "Failed to open database / persistence directory" error, `rm -rf .next` and retry (iCloud corrupts the Turbopack cache).
- **Next.js is unfamiliar:** per `AGENTS.md`, read `node_modules/next/dist/docs/` before using any Next 16 metadata/OG API you're unsure of. **Proven reference:** the sister repo `~/Documents/Claude/Websites/central-home-health` has working `lib/metadata.ts`, `lib/seo.ts`, `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, and `next.config.ts` — read and adapt each (Lifecare values, single service line; do NOT copy its two-phone-line JSON-LD, gold/Fraunces branding, or Formspree CSP entries).
- **Real values (from `lib/site-config.ts`):** name "Lifecare Options", phone `(281) 646-9546`, fax `(281) 646-9757`, `intakeEmail`, address 434 Park Grove Dr, Katy, TX 77450, hours Mon–Thu 8–5 / Fri 8–4, founded 2008, CHAP-accredited, CCN `747061`, license `011908`, service-area counties Harris + Fort Bend, cities per config. **Site URL:** `https://www.mylifecareoptions.com`.
- **i18n parity:** any new user-facing string (incl. SEO titles/descriptions) added to `messages/en.json` MUST be added to `messages/es.json` with the same English value (Spanish is Spec 2). Keep identical key shape.
- **Copy voice:** SEO titles/descriptions follow the same de-AI rule — plain, specific, honest, NO banned phrases ("seamless", "empower", "elevate", "unlock", "journey", "we're passionate", "committed to excellence"), NO em-dashes, NO invented claims/superlatives ("best", "#1", "top-rated"), NO guaranteed outcomes. Single skilled-home-health line, one phone.
- **Do not regress:** the existing 114 tests stay green; `/en` + `/es` + all 8 routes keep building and returning 200; en/es parity holds.
- **Green gate** before a task is done: `typecheck` + `lint` + `test` + `build`.
- **Commits:** frequent TDD commits. Never push.

---

## File Structure

**Create:** `lib/metadata.ts`, `lib/seo.ts`, `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, tests under `tests/`.
**Modify:** `app/layout.tsx` (metadataBase — already set), `app/[locale]/layout.tsx` (default metadata + `<JsonLd>`), each `app/[locale]/**/page.tsx` (add `generateMetadata`), `next.config.ts` (security headers + CSP), `lib/site-config.ts` (fill CCN/license), `components/Button.tsx` (CTA contrast), `messages/en.json` + `es.json` (SEO title/description keys).

---

## Task 1: Fill verified-candidate license numbers in site-config

**Files:** Modify `lib/site-config.ts`; Test `tests/site-config.test.ts` (extend).

**Interfaces:** Produces `siteConfig.medicareCcn = "747061"`, `siteConfig.stateLicense = "011908"` (strings, not null) for JSON-LD + About to read as single source.

- [ ] **Step 1: Write the failing test** — add to `tests/site-config.test.ts`:
```ts
it("carries the recovered CCN and state license", () => {
  expect(siteConfig.medicareCcn).toBe("747061");
  expect(siteConfig.stateLicense).toBe("011908");
});
```
- [ ] **Step 2: Run it — verify it fails** (`npx vitest run tests/site-config.test.ts`) — FAIL (currently null).
- [ ] **Step 3: Set the values** in `lib/site-config.ts`: `medicareCcn: "747061"` and `stateLicense: "011908"` (replace the `null` + keep the `// verify before launch` comment).
- [ ] **Step 4: Run test — PASS.**
- [ ] **Step 5: typecheck + commit**
```bash
git add lib/site-config.ts tests/site-config.test.ts
git commit -m "feat: fill recovered CCN + state license in site-config (verify before launch)"
```

---

## Task 2: Metadata helper (canonical + OG + Twitter + hreflang)

**Files:** Create `lib/metadata.ts`; Modify `app/[locale]/layout.tsx`; Test `tests/metadata.test.ts`.

**Interfaces:** Produces `SITE_URL`, `SITE_NAME`, `TITLE_TEMPLATE`, `DEFAULT_DESCRIPTION`, and `buildMetadata({ title, description?, path, locale }): Metadata` returning `title`, `description`, `alternates` (canonical + `languages` for en/es hreflang), `openGraph`, `twitter`.

- [ ] **Step 1** — Read Central's `lib/metadata.ts` for the exact `Metadata` shape/fields Next 16 expects. Adapt: `SITE_URL="https://www.mylifecareoptions.com"`, `SITE_NAME="Lifecare Options"`, `TITLE_TEMPLATE="%s | Lifecare Options"`, a `DEFAULT_DESCRIPTION` (plain, honest, e.g. "Medicare-certified skilled home health — nursing, therapy, and personal care at home across Katy, Fort Bend, and Harris counties since 2008.").

- [ ] **Step 2: Write the failing test** — `tests/metadata.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { buildMetadata, SITE_URL } from "@/lib/metadata";

describe("buildMetadata", () => {
  it("builds a localized canonical + hreflang alternates", () => {
    const m = buildMetadata({ title: "Services", description: "d", path: "/services", locale: "en" });
    expect(m.title).toBe("Services");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services`);
    expect(m.alternates?.languages?.["es"]).toBe(`${SITE_URL}/es/services`);
    expect(m.alternates?.languages?.["en"]).toBe(`${SITE_URL}/services`);
    expect(m.openGraph?.url).toBe(`${SITE_URL}/services`);
  });
  it("uses the site root for the home path", () => {
    const m = buildMetadata({ title: "Home", path: "/", locale: "en" });
    expect(m.alternates?.canonical).toBe(SITE_URL);
    expect(m.alternates?.languages?.["es"]).toBe(`${SITE_URL}/es`);
  });
});
```
- [ ] **Step 3: Run — FAIL.**
- [ ] **Step 4: Implement `lib/metadata.ts`.** `buildMetadata` maps `path` ("/" or "/services") to: canonical `SITE_URL + (path === "/" ? "" : path)` for `en`; `languages.en` = same; `languages.es` = `SITE_URL + "/es" + (path === "/" ? "" : path)`; `openGraph` `{ type:"website", url: <canonical>, siteName: SITE_NAME, locale: locale === "es" ? "es_US" : "en_US" }`; `twitter { card: "summary_large_image" }`. (For a locale-aware canonical, when `locale === "es"` the canonical is the `/es` variant — implement so an es page's canonical is its own es URL. Keep the test's en expectations passing.)
- [ ] **Step 5** — In `app/[locale]/layout.tsx` set the default `metadata` (or `generateMetadata`) using `SITE_NAME` + `TITLE_TEMPLATE` + `DEFAULT_DESCRIPTION` + `metadataBase` (mirror Central's layout metadata block).
- [ ] **Step 6: Run test — PASS.**
- [ ] **Step 7: typecheck + commit** (`feat: add SEO metadata helper with canonical + hreflang`).

---

## Task 3: Per-page metadata (titles + descriptions, all 9 pages)

**Files:** Modify every `app/[locale]/**/page.tsx` (home + 8) to add `generateMetadata`; add `meta` title/description keys to `messages/en.json` + `es.json` (namespace `<page>.meta.title` / `.meta.description`); Test `tests/pages-metadata.test.ts`.

**Interfaces:** Consumes `buildMetadata` (Task 2). Each page exports `export async function generateMetadata({ params }): Promise<Metadata>` that reads its `meta.title`/`meta.description` via `getTranslations` and returns `buildMetadata({ title, description, path, locale })`.

- [ ] **Step 1** — Author a concise, honest, keyword-sensible SEO title + description per page into `messages/en.json` under each page namespace as `meta.title` and `meta.description` (mirror into `es.json`). Titles ≤ ~60 chars, descriptions ≤ ~155 chars. Examples (adapt, keep de-AI + honest, no superlatives):
  - home: title "Skilled Home Health in Katy, TX" · desc "Medicare-certified nursing, therapy, and personal care at home across Katy, Fort Bend, and Harris counties. Serving families since 2008."
  - services: title "Home Health Services" · desc "Skilled nursing, physical/occupational/speech therapy, medical social work, home health aide, and remote patient monitoring at home."
  - about, service-area, careers, refer, contact, remote-patient-monitoring, accessibility: one honest title + description each.
- [ ] **Step 2: Write the failing test** — `tests/pages-metadata.test.ts` importing each page's `generateMetadata` and asserting it returns a non-empty `title` and a canonical under `SITE_URL` for locale "en". (Call with `params: Promise.resolve({ locale: "en" })`.) Example for one page:
```ts
import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/metadata";
import { generateMetadata as servicesMeta } from "@/app/[locale]/services/page";

describe("services metadata", () => {
  it("returns a title and canonical", async () => {
    const m = await servicesMeta({ params: Promise.resolve({ locale: "en" }) });
    expect(typeof m.title).toBe("string");
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/services`);
  });
});
```
Add one such assertion per page (home canonical = `SITE_URL`).
- [ ] **Step 3: Run — FAIL** (no `generateMetadata` yet).
- [ ] **Step 4: Split each page into a server shell + a client body (REQUIRED).** Next.js does NOT allow a `"use client"` file to export `generateMetadata` — and every page is currently a client component (it calls `useTranslations`). So for each route you MUST:
  1. Move the current client page body into a sibling `"use client"` component, e.g. `app/[locale]/services/ServicesContent.tsx` (the exact current JSX + its `"use client"` + `useTranslations` — unchanged).
  2. Replace `app/[locale]/services/page.tsx` with a **server** component that exports `generateMetadata` and renders the client body:
```ts
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { ServicesContent } from "./ServicesContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/services", locale });
}

export default function ServicesPage() {
  return <ServicesContent />;
}
```
  Do this for all 9 pages (home = `app/[locale]/page.tsx` → server shell rendering `HomeContent` from `app/[locale]/HomeContent.tsx`; path `/`). The client body keeps working via the `NextIntlClientProvider` + `setRequestLocale` already set in `app/[locale]/layout.tsx`. This split also makes each page shell a server component (a small perf win) without touching the interactive/motion client islands.
> Update any test that imports the page's default component to import from the new content component (e.g. `@/app/[locale]/services/ServicesContent`) where it was rendering the body; `generateMetadata` is imported from `page.tsx`.
- [ ] **Step 5: Run test — PASS** (all pages). Fix parity (`node` parity check from Plan 2 Task 13).
- [ ] **Step 6: typecheck + build + commit** (`feat: add per-page SEO metadata`).

---

## Task 4: MedicalBusiness JSON-LD

**Files:** Create `lib/seo.ts`, `components/seo/JsonLd.tsx`; Modify `app/[locale]/layout.tsx` (render `<JsonLd>` in `<head>`); Test `tests/seo.test.ts`.

**Interfaces:** Produces `medicalBusinessJsonLd()` returning a schema.org `MedicalBusiness` object from `site-config`; `<JsonLd data={...} />` renders a `<script type="application/ld+json">`.

- [ ] **Step 1** — Read Central's `lib/seo.ts` + `components/seo/JsonLd.tsx` for the JSON-LD shape + safe-escaping pattern.
- [ ] **Step 2: Write the failing test** — `tests/seo.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { medicalBusinessJsonLd } from "@/lib/seo";

describe("medicalBusinessJsonLd", () => {
  it("emits the agency's real NAP + credentials", () => {
    const d = medicalBusinessJsonLd();
    expect(d["@type"]).toBe("MedicalBusiness");
    expect(d.name).toBe("Lifecare Options");
    expect(d.telephone).toContain("281");
    expect(d.address.addressLocality).toBe("Katy");
    expect(JSON.stringify(d)).toContain("747061"); // CCN present
  });
});
```
- [ ] **Step 3: Run — FAIL.**
- [ ] **Step 4: Implement `lib/seo.ts`** — `medicalBusinessJsonLd()` reads `siteConfig`: `@context`, `@type: "MedicalBusiness"`, `name`, `url: SITE_URL`, `telephone`, `faxNumber`, `address` (PostalAddress: street/Katy/TX/77450), `areaServed` (cities as `{"@type":"City","name":...}`), `openingHours` (e.g. `["Mo-Th 08:00-17:00","Fr 08:00-16:00"]`), `identifier` for CCN `747061` + license `011908`, `logo`/`image` (icon endpoints if present, else omit). Single telephone (no second line).
- [ ] **Step 5: Implement `components/seo/JsonLd.tsx`** (escape `<` to prevent breakout, mirror Central). Render `<JsonLd data={medicalBusinessJsonLd()} />` in `app/[locale]/layout.tsx` `<head>`.
- [ ] **Step 6: Run test — PASS.**
- [ ] **Step 7: typecheck + build + commit** (`feat: add MedicalBusiness JSON-LD`).

---

## Task 5: sitemap.ts + robots.ts

**Files:** Create `app/sitemap.ts`, `app/robots.ts`; Test `tests/sitemap.test.ts`.

**Interfaces:** `sitemap()` returns entries for all 9 routes × {en at `/…`, es at `/es/…`}; `robots()` allows all + points to the sitemap.

- [ ] **Step 1** — Read Central's `app/sitemap.ts` + `app/robots.ts` for the Next 16 `MetadataRoute` shape.
- [ ] **Step 2: Write the failing test** — `tests/sitemap.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes home and every page for both locales", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.mylifecareoptions.com");
    expect(urls).toContain("https://www.mylifecareoptions.com/services");
    expect(urls).toContain("https://www.mylifecareoptions.com/es/services");
    expect(urls.length).toBeGreaterThanOrEqual(18); // 9 routes x 2 locales
  });
});
```
- [ ] **Step 3: Run — FAIL.**
- [ ] **Step 4: Implement** `app/sitemap.ts` (a `routes` array `["", "/services", "/about", "/service-area", "/careers", "/refer", "/contact", "/remote-patient-monitoring", "/accessibility"]`, mapped to en + es URLs; home priority 1.0, others 0.8; `changeFrequency: "monthly"`) and `app/robots.ts` (`rules: { userAgent: "*", allow: "/" }`, `sitemap: SITE_URL + "/sitemap.xml"`).
- [ ] **Step 5: Run test — PASS.**
- [ ] **Step 6: build + commit** (`feat: add sitemap and robots`).

---

## Task 6: Branded OpenGraph image

**Files:** Create `app/opengraph-image.tsx`; (no unit test — verified via build).

- [ ] **Step 1** — Read Central's `app/opengraph-image.tsx` for the `next/og` `ImageResponse` pattern (size, runtime, font loading).
- [ ] **Step 2: Implement** a 1200×630 `ImageResponse`: navy `#0F2B47` background, a care-blue `#5A8BB8` accent bar, "Lifecare Options" in a serif (Playfair if a font buffer is loaded like Central does; otherwise a system serif fallback — do NOT fail the build over font loading), a "Home Health · Katy, TX" subtitle, and the peach-cream accent. Export `size`, `contentType`, and the default component per Next 16 conventions.
- [ ] **Step 3: Verify** `npm run build` succeeds and generates the opengraph-image route. (If font fetching is flaky in the build sandbox, fall back to a system font so the build stays green.)
- [ ] **Step 4: commit** (`feat: add branded OpenGraph image`).

---

## Task 7: Security headers + CSP (permit the contact map)

**Files:** Modify `next.config.ts`; (verified via build + a header assertion test if practical, else build + manual note).

- [ ] **Step 1** — Read Central's `next.config.ts` `headers()` + CSP. Adapt for Lifecare: KEEP `default-src 'self'`, `base-uri 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `img-src 'self' data:`, `font-src 'self'` (next/font self-hosts — drop gstatic), `style-src 'self' 'unsafe-inline'` (Tailwind/motion; drop googleapis since fonts self-hosted), `script-src 'self' 'unsafe-inline'`, `connect-src 'self'` (lead form posts to same-origin `/api/lead` — NO Formspree), `frame-src https://www.google.com https://maps.google.com` (contact map), `form-action 'self'`, `upgrade-insecure-requests`. Keep HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. Keep `poweredByHeader: false`, `productionBrowserSourceMaps: false`. Preserve the existing `withNextIntl(...)` wrap.
- [ ] **Step 2: Verify** `npm run build` succeeds; then `npm run dev` and confirm the `/contact` Google Maps iframe still loads under the CSP (curl the page 200; note that iframe rendering is a browser check — verify the CSP `frame-src` includes google/maps). Also confirm `/api/lead` still works conceptually (connect-src 'self').
- [ ] **Step 3: commit** (`feat: add security headers + CSP (allows contact map)`).

---

## Task 8: Accessibility — primary CTA contrast to WCAG AA

**Files:** Modify `components/Button.tsx` (and/or `app/globals.css` token); Test `tests/button.test.tsx` (extend); a contrast calc note in the report.

**Context:** The primary CTA is navy `#0F2B47` text on care-blue `#5A8BB8` ≈ 4.25:1 — just under the 4.5:1 WCAG AA threshold for normal text.

- [ ] **Step 1: Compute** the exact contrast ratio of navy `#0F2B47` on care-blue `#5A8BB8` (WCAG formula). Confirm it's < 4.5:1.
- [ ] **Step 2: Choose the minimal fix** that reaches ≥ 4.5:1 while staying on-brand, in this order of preference: (a) darken the *primary-button* care-blue background to a shade that yields ≥ 4.5:1 with navy text (e.g. introduce a `--color-care-blue-deep` token used only by the primary Button bg; compute the exact hex that passes) — keeps navy text + a care-blue button; (b) if no acceptable darker blue works, keep `#5A8BB8` and switch primary text to white ONLY if white reaches ≥ 4.5:1 (it does not on #5A8BB8, so (a) is expected). Document the chosen hex + its computed ratio.
- [ ] **Step 3: Write/extend the test** — assert the primary Button renders the chosen accessible background class (e.g. `bg-care-blue-deep`), and keep the existing "renders primary variant" test green (update its class expectation).
- [ ] **Step 4: Implement** — add the token to `globals.css @theme` and point `VARIANT_STYLES.primary` bg at it (text stays navy). Re-run the contrast calc to confirm ≥ 4.5:1.
- [ ] **Step 5: Run tests — PASS; typecheck + build.**
- [ ] **Step 6: commit** (`fix: bring primary CTA to WCAG AA contrast`).

---

## Task 9: Final green gate + SEO/a11y QA

**Files:** none (verification + fixes).

- [ ] **Step 1: iCloud conflict cleanup** (`find … -name "* [0-9].*" … -delete`).
- [ ] **Step 2: Parity** — the en/es key-parity `node` check prints `PARITY OK`; no em-dashes in messages (`grep -rn "—" messages/` empty).
- [ ] **Step 3: Gate** — `npm run typecheck && npm run lint && npm run test && npm run build` all clean/green. Build must emit `sitemap.xml`, `robots.txt`, `opengraph-image`, and all routes under `/en` + `/es`.
- [ ] **Step 4: SEO smoke** — start dev; confirm: `curl -s localhost:PORT/robots.txt` shows the sitemap line; `curl -s localhost:PORT/sitemap.xml` lists the routes; `curl -s localhost:PORT/ | grep -o '<title>[^<]*'` shows a real title; `curl -s localhost:PORT/ | grep -c 'application/ld+json'` ≥ 1; a page's HTML contains a `<link rel="canonical"` and `hreflang` alternates. Stop dev.
- [ ] **Step 5: a11y note** — record the primary-CTA contrast ratio (now ≥ 4.5:1) and confirm the reduced-motion + skip-link + focus-visible behaviors from Plan 1 are intact.
- [ ] **Step 6: commit** any fixes (`chore: P3 green gate — SEO/robots/sitemap/JSON-LD/OG/CSP/contrast verified`).

---

## Definition of done (Plan 3)

- Every page has a unique, honest title + description; canonical + en/es hreflang alternates emitted; `MedicalBusiness` JSON-LD with real NAP + CCN/license in the layout; `sitemap.xml` (all routes × both locales) + `robots.txt`; a branded OG image.
- Security headers + CSP present, and the contact Google Map still loads under the CSP.
- Primary CTA meets WCAG AA contrast (≥ 4.5:1).
- `typecheck` + `lint` + `test` + `build` green; en/es parity; no em-dashes; all routes 200.

## Explicitly deferred (NOT in Plan 3)

- **Spanish content (Spec 2)** — `es.json` stays English-value; service/city names must move from `site-config` into messages (or a locale-keyed data layer) before ES translation.
- **`"use client"` → server-component perf refactor** — pages are SSG-prerendered so SEO is unaffected; this is a JS-payload optimization only, tracked as a future nicety.
- **Deployment (phase-0 HANDOFF Task 19)** — Vercel project, `RESEND_API_KEY`, DNS cutover Wix→Vercel, and verifying CCN `747061` / license `011908` against LCO records — done by Clint at launch.
- **Real photography, testimonials, open roles** — added when available (components already support them via honest empty states).
