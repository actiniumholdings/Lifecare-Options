# Lifecare Full Site — Plan 2: Pages & Content

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the English marketing site — finish the home page's stubbed sections and build the 8 remaining pages (Services, About, Service Area, Careers, Refer, Contact, Remote Patient Monitoring, Accessibility) with real Lifecare-voiced copy, a shared CTA band, and an animated Service-Area map.

**Architecture:** Continue on the `feat/full-site` branch built in Plan 1. Every page composes the existing primitives (`Hero`, `Section`, `Eyebrow`, `Stat`, `Band`, `Button`, plus a new shared `CtaBand`) and reads all copy from `next-intl` messages. Content data (service area, specialties, insurance) lives in `lib/site-config.ts`; a client `ServiceMap` SVG renders the coverage counties. No SEO yet (that's Plan 3) — but every route is real and navigable.

**Tech Stack:** Next.js 16.2.x (App Router, `[locale]`), React 19, Tailwind v4, `next-intl` v4, `motion/react`, Vitest + Testing Library. (Deployment/SEO deferred to Plan 3.)

## Global Constraints

_Every task's requirements implicitly include this section._

- **Worktree:** work in `~/Documents/Claude/Projects/lifecare-full-site` (branch `feat/full-site`, continues from Plan 1 HEAD `f970150`). **cd into it at the start of every shell command** (iCloud repo). Before any `tsc`/`build`, delete iCloud conflict copies: `find . -path ./node_modules -prune -o \( -name "* [0-9].ts" -o -name "* [0-9].tsx" \) -print -delete`.
- **Next.js is unfamiliar:** per `AGENTS.md`, read `node_modules/next/dist/docs/` before using any Next 16 API you're unsure of. Reference the sister repo `~/Documents/Claude/Websites/central-home-health` for proven page patterns (its pages are photography-forward — copy the *structure*, not the imagery or the two-service-line model).
- **Reuse, don't rebuild:** compose `components/ui/` primitives (`Container`, `Section`, `Eyebrow`, `Stat`, `Hero`, `Band`) + `components/Button.tsx` (primary = care-blue fill + navy text) + `components/LeadForm.tsx` + `components/ServicesList.tsx`. Add only the shared `CtaBand` (Task 2) and `ServiceMap` (Task 3).
- **i18n & parity:** all user-facing copy comes from `useTranslations` — NO hardcoded UI strings in components. Every key added to `messages/en.json` MUST also be added to `messages/es.json` with the SAME English value for now (Spanish authoring is Spec 2). The two files must always have identical key shape or `/es` breaks at runtime. Consume server-side with `useTranslations`/`getTranslations` inside the provider.
- **Single service line:** Lifecare is skilled home health only (7 services in `siteConfig.services`) — ONE phone line `(281) 646-9546`. Do NOT introduce a second "attendant/PAS" line or a second phone (that's Central's model, not Lifecare's).
- **Copy voice (house rule):** warm, clinician-led, plain, specific. **De-AI:** no formulaic/hollow phrasing — banned: "seamless", "empower", "at the heart of", "Built by X, for Y", "unlock", "elevate", "journey" (as filler), "we're passionate", em-dash-itis, throat-clearing intros. Write like a knowledgeable nurse talking to a worried family.
- **Healthcare compliance:** no guaranteed outcomes or invented statistics. Coverage copy (Insurance section, RPM page) MUST be hedged: e.g. "Medicare-certified; most plans and Medicare are accepted, and we verify your benefits at no cost before care begins." No invented program names, dollar figures, or "always covered" claims. Honest empty states: Testimonials and Open Roles render truthful placeholders — NEVER fabricate reviews or job postings.
- **Structure:** every page's first element is a `Hero` (the page's single `<h1>`); every page ends with the shared `CtaBand` (navy). Nav links to all routes already exist (`components/Nav.tsx` from Plan 1) — verify each new route resolves.
- **Every page must build and render under BOTH `/` (en) and `/es`.** Task verification includes `npm run build` succeeding and (for page tasks) a component render test.
- **Commits:** frequent TDD commits. Never push. Keep tests tracked. Green gate (typecheck + lint + test + build) before a task is done.

---

## File Structure

**Create:**
- `components/ui/CtaBand.tsx` — shared navy closing CTA band (headline + up to 2 CTAs)
- `components/area/ServiceMap.tsx` — client SVG map of Harris + Fort Bend with pins, reduced-motion-safe
- `lib/coverage-counties.ts` — county → color data for the map
- `app/[locale]/services/page.tsx`, `about/page.tsx`, `service-area/page.tsx`, `careers/page.tsx`, `refer/page.tsx`, `contact/page.tsx`, `remote-patient-monitoring/page.tsx`, `accessibility/page.tsx`
- Tests under `tests/` per task

**Modify:**
- `lib/site-config.ts` — add `serviceArea`, `specialties`, `insurancePlans`, `positions`, `testimonials`
- `app/[locale]/page.tsx` — replace the 7 stub sections with real sections
- `messages/en.json` + `messages/es.json` — add a keyed namespace per page (`home` additions, `services`, `about`, `serviceArea`, `careers`, `refer`, `contact`, `rpm`, `accessibility`, shared `cta`)

---

## Task 1: Content data model

**Files:**
- Modify: `lib/site-config.ts`
- Create: `lib/coverage-counties.ts`
- Test: `tests/site-config.test.ts`

**Interfaces:**
- Produces: `siteConfig.serviceArea = { counties: readonly {name,color}[], cities: readonly string[] }`; `specialties: readonly string[]`; `insurancePlans: readonly string[]`; `positions: readonly {title:string, type?:string}[]` (empty for now); `testimonials: readonly {quote:string, attribution:string}[]` (empty). `coverageCounties` from `lib/coverage-counties.ts`.

- [ ] **Step 1: Write the failing test**

Create `tests/site-config.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { coverageCounties } from "@/lib/coverage-counties";

describe("service area data", () => {
  it("covers Harris and Fort Bend and lists Katy-area cities", () => {
    expect(siteConfig.serviceArea.counties.map((c) => c.name)).toEqual([
      "Harris County",
      "Fort Bend County",
    ]);
    expect(siteConfig.serviceArea.cities).toContain("Katy");
    expect(siteConfig.serviceArea.cities.length).toBeGreaterThanOrEqual(8);
  });
  it("exposes specialties and insurance plans", () => {
    expect(siteConfig.specialties.length).toBeGreaterThanOrEqual(6);
    expect(siteConfig.insurancePlans.length).toBeGreaterThanOrEqual(3);
  });
  it("starts with honest-empty positions and testimonials", () => {
    expect(siteConfig.positions).toEqual([]);
    expect(siteConfig.testimonials).toEqual([]);
  });
  it("maps counties to colors for the map", () => {
    expect(coverageCounties.map((c) => c.name)).toEqual([
      "Harris County",
      "Fort Bend County",
    ]);
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/site-config.test.ts`
Expected: FAIL — new fields / module don't exist yet.

- [ ] **Step 3: Create `lib/coverage-counties.ts`**

```ts
// County → brand color for the ServiceMap SVG + the Service Area legend.
// Plain module (no "use client") so both the client map and the server page
// can import it without crossing the RSC boundary.
export const coverageCounties = [
  { name: "Harris County", color: "#5a8bb8" }, // care-blue — Katy/west Houston
  { name: "Fort Bend County", color: "#0f2b47" }, // navy
] as const;
```

- [ ] **Step 4: Extend `lib/site-config.ts`**

Append to the `siteConfig` object (after `stateLicense`), and add the exported arrays after `services`:
```ts
  serviceArea: {
    counties: [
      { name: "Harris County", color: "#5a8bb8" },
      { name: "Fort Bend County", color: "#0f2b47" },
    ],
    cities: [
      "Katy",
      "Cypress",
      "Fulshear",
      "Richmond",
      "Rosenberg",
      "Sugar Land",
      "Missouri City",
      "Brookshire",
      "West Houston",
    ],
  },
  specialties: [
    "Wound care",
    "Congestive heart failure",
    "COPD & respiratory",
    "Diabetes management",
    "Post-surgical recovery",
    "Stroke recovery",
    "Fall prevention",
    "Medication management",
  ],
  insurancePlans: [
    "Medicare",
    "Medicare Advantage",
    "Medicaid",
    "Most private / commercial plans",
    "Private pay",
  ],
  positions: [] as readonly { title: string; type?: string }[],
  testimonials: [] as readonly { quote: string; attribution: string }[],
```
(These live inside `siteConfig as const`. If `as const` makes the empty arrays typed `never[]`, keep the explicit `as readonly {...}[]` annotations shown above so later `.map` calls type-check.)

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/site-config.test.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck + commit**

```bash
cd ~/Documents/Claude/Projects/lifecare-full-site && npm run typecheck
git add lib/site-config.ts lib/coverage-counties.ts tests/site-config.test.ts
git commit -m "feat: add service-area, specialties, insurance, positions, testimonials data"
```

---

## Task 2: Shared CtaBand component

**Files:**
- Create: `components/ui/CtaBand.tsx`
- Test: `tests/ui/cta-band.test.tsx`

**Interfaces:**
- Consumes: `Section`, `Button`, `Container`.
- Produces: `CtaBand({ headline, primary?, secondary? })` where `primary`/`secondary` = `{ label: string, href: string }`. Renders a navy `Section` with an `<h2>` headline (Playfair) + the CTAs. Used at the bottom of every page.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/cta-band.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaBand } from "@/components/ui/CtaBand";

describe("CtaBand", () => {
  it("renders a level-2 heading and CTA links", () => {
    render(
      <CtaBand
        headline="Ready to bring care home?"
        primary={{ label: "Request info", href: "/contact" }}
        secondary={{ label: "Call (281) 646-9546", href: "tel:+12816469546" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Ready to bring care home?",
    );
    expect(screen.getByRole("link", { name: "Request info" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(
      screen.getByRole("link", { name: /call/i }),
    ).toHaveAttribute("href", "tel:+12816469546");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/cta-band.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/ui/CtaBand.tsx`**

```tsx
import { Section } from "./Section";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };

export function CtaBand({
  headline,
  primary,
  secondary,
}: {
  headline: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <Section tone="dark" className="text-center">
      <h2 className="mx-auto max-w-2xl text-mist">{headline}</h2>
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primary && (
            <Button href={primary.href} size="lg">
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button href={secondary.href} variant="secondary" size="lg" className="!border-mist !text-mist hover:!bg-mist/10">
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </Section>
  );
}
```
> The secondary Button's default navy outline is invisible on the navy band, so it's overridden to a mist outline here. If `Button`'s `className` doesn't merge (it uses `twMerge`, so it will), confirm the override wins.

- [ ] **Step 4: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/cta-band.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/CtaBand.tsx tests/ui/cta-band.test.tsx
git commit -m "feat: add shared CtaBand closing component"
```

---

## Task 3: ServiceMap component

**Files:**
- Create: `components/area/ServiceMap.tsx`
- Test: `tests/area/service-map.test.tsx`

**Interfaces:**
- Consumes: `coverageCounties` (Task 1).
- Produces: `ServiceMap()` — a `"use client"` SVG showing the two coverage counties as labeled color blocks with a legend, honoring `prefers-reduced-motion` (no animation when reduced). Kept intentionally simple (stylized blocks + pins, NOT real GIS boundaries) to avoid an external map dependency.

- [ ] **Step 1: Write the failing test**

Create `tests/area/service-map.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/area/service-map.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/area/ServiceMap.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import { coverageCounties } from "@/lib/coverage-counties";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function ServiceMap() {
  const reduced = useReducedMotionSafe();
  return (
    <figure role="img" aria-label="Lifecare Options coverage map — Harris and Fort Bend counties" className="w-full">
      <svg viewBox="0 0 320 220" className="w-full rounded-2xl bg-mist" aria-hidden>
        {/* Harris — top-right block */}
        <motion.rect
          x="150" y="20" width="150" height="120" rx="10"
          fill={coverageCounties[0].color}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Fort Bend — bottom-left block */}
        <motion.rect
          x="20" y="90" width="150" height="110" rx="10"
          fill={coverageCounties[1].color}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 0.2 }}
        />
        {/* Katy pin at the county overlap */}
        <circle cx="150" cy="110" r="7" fill="#fdeedd" stroke="#0f2b47" strokeWidth="2" />
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-4">
        {coverageCounties.map((c) => (
          <span key={c.name} className="inline-flex items-center gap-2 text-sm text-slate">
            <span className="h-3 w-3 rounded-sm" style={{ background: c.color }} aria-hidden />
            {c.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
```
> Confirm `lib/use-reduced-motion-safe.ts` exports `useReducedMotionSafe` (it exists from phase-0). If its signature differs, adapt the import.

- [ ] **Step 4: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/area/service-map.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/area/ServiceMap.tsx tests/area/service-map.test.tsx
git commit -m "feat: add ServiceMap coverage component"
```

---

## Tasks 4–12: Pages (shared pattern)

**Every page task follows the same shape.** For each, the implementer:
1. **Authors copy** into `messages/en.json` under the page's namespace, and mirrors the SAME keys with the SAME English values into `messages/es.json` (parity — Spec 2 translates). Copy must follow the Global voice + compliance rules.
2. **Builds** `app/[locale]/<route>/page.tsx` (or edits `app/[locale]/page.tsx` for the home task) as a composition of primitives, reading every string via `useTranslations("<namespace>")`. First element is a `Hero` (single `<h1>`); last element is `<CtaBand>`.
3. **Writes a render test** `tests/pages/<route>.test.tsx` wrapping the page in `NextIntlClientProvider` with real `en.json`, asserting the `<h1>` text and one section-specific element.
4. **Verifies**: focused test → full suite → `npm run typecheck` → `npm run build` (both `/en` and `/es` generate) → commit.

Each task below gives the section list, the message-key namespace with per-key intent + fixed facts, and the composition skeleton. **Author the prose to the voice rules; do not ship the intent text as the copy.**

Reference the page's real facts from `siteConfig`: phone `(281) 646-9546` / `phoneHref`, fax `(281) 646-9757`, `intakeEmail`, `jobsEmail`, address 434 Park Grove Dr, Katy, TX 77450, hours Mon–Thu 8–5 / Fri 8–4, founded 2008, CHAP-accredited, CCN 747061, license 011908 (both marked verify-before-launch), the 7 `services`, `specialties`, `insurancePlans`, `serviceArea`.

---

### Task 4: Complete the Home page

**Files:** Modify `app/[locale]/page.tsx`; add keys to `messages/en.json`+`es.json` under `home`; Test `tests/pages/home-sections.test.tsx`.

**Sections (replace the 7 stubs, keep Hero + trust + services + `#contact` LeadForm):**
1. **How It Works** — `Section` light, `Eyebrow` + `<h2>` + 3 numbered steps: (1) You reach out, (2) We coordinate with your doctor, (3) Care begins at home. Keys `home.how.eyebrow/title/step1Title/step1Body/...step3Body`.
2. **Why Lifecare** — `Section` dark, 4 differentiator cards: Medicare-certified & CHAP-accredited; Locally owned in Katy since 2008; 24/7 on-call nursing; Coordinated with your physician. Keys `home.why.*`.
3. **Editorial `<Band>`** — eyebrow + a single warm statement headline (e.g. about healing where life happens). Keys `home.band.eyebrow/headline`.
4. **Service-Area teaser** — `Section` light, 2-col: copy + a pill grid of `siteConfig.serviceArea.cities` + a "See our service area →" link to `/service-area`. Keys `home.area.title/body/cta`.
5. **Testimonials** — `Section` light, honest empty state: if `siteConfig.testimonials.length === 0`, render a quiet "Reviews from families are coming soon." card (keys `home.testimonials.title/empty`). Never fabricate.
6. **Careers teaser** — `Section` light with a care-blue accent card inviting caregivers, link to `/careers`. Keys `home.careers.title/body/cta`.
7. **Final CTA** — `<CtaBand headline={t("home.cta.headline")} primary={{label: t("home.cta.primary"), href: "/contact"}} secondary={{label: t("common.callUs")+" "+siteConfig.phone, href: siteConfig.phoneHref}} />`. Keys `home.cta.headline/primary`.

Keep the existing Hero, trust `Section` (Stats), services `Section` (ServicesList), and `#contact` `Section` (LeadForm) in order: Hero → trust → services → How It Works → Why Lifecare → Band → Service-Area teaser → Testimonials → Careers teaser → `#contact` LeadForm → Final CTA.

**Test asserts:** `<h1>` "felt at home"; the How-It-Works `<h2>`; a city pill (e.g. "Katy"); the testimonials empty-state text.

**Commit:** `feat: complete home page sections with real copy`.

---

### Task 5: /services

**Files:** Create `app/[locale]/services/page.tsx`; keys under `services`; Test `tests/pages/services.test.tsx`.

**Sections:**
1. **Hero** — eyebrow "Our Services", `<h1>` e.g. "Skilled care, brought home." CTAs: primary `/contact`, secondary `phoneHref`.
2. **Skilled Home Health pillar** — `Section` light: intro + the 7 `siteConfig.services` as `Card`s (name + description from config; you may key a richer one-line elaboration per service under `services.detail.<iconName>`).
3. **Specialties grid** — `Section` dark: eyebrow "Conditions we support", `<h2>`, the `siteConfig.specialties` as chips.
4. **Insurance & coverage** — `Section` light: eyebrow "Insurance & coverage", `<h2>`, the `siteConfig.insurancePlans` as a list + a HEDGED sentence ("We verify your benefits at no cost before care begins.") — no "always covered" claims.
5. **CtaBand.**

**Test asserts:** `<h1>`; a service name (e.g. "Skilled Nursing"); a specialty (e.g. "Wound care").

**Commit:** `feat: add /services page`.

---

### Task 6: /about

**Files:** Create `app/[locale]/about/page.tsx`; keys under `about`; Test `tests/pages/about.test.tsx`.

**Sections:** Hero (eyebrow "About", `<h1>` about serving Katy since 2008) → Story & mission (`Section` light, 2-col prose + mission card) → editorial `Band` → Values/commitments (`Section` dark, cards incl. a bilingual-care commitment) → Credentials (`Section` light, cards: CHAP-accredited, Medicare-certified [CCN 747061], Texas license 011908, Serving since 2008 — mark CCN/license as the real recovered values) → CtaBand.

**Test asserts:** `<h1>`; "CHAP" credential; "2008".

**Commit:** `feat: add /about page`.

---

### Task 7: /service-area

**Files:** Create `app/[locale]/service-area/page.tsx`; keys under `serviceArea` (page namespace — distinct from `nav.serviceArea`); Test `tests/pages/service-area.test.tsx`.

**Sections:** Hero (eyebrow "Where we serve", `<h1>`) → Counties strip (`siteConfig.serviceArea.counties`) → Cities grid (`siteConfig.serviceArea.cities` as pills) → `Section` dark with `<ServiceMap/>` + a "Don't see your city? Call us" callout (phone) → CtaBand.

**Test asserts:** `<h1>`; "Harris County"; a city pill; the ServiceMap figure (`getByRole("img", {name:/coverage map/i})`).

**Commit:** `feat: add /service-area page with ServiceMap`.

---

### Task 8: /careers

**Files:** Create `app/[locale]/careers/page.tsx`; keys under `careers`; Test `tests/pages/careers.test.tsx`.

**Sections:** Hero (eyebrow "Careers", `<h1>` e.g. "Care for people, close to home."; support line "RN · LVN · Home Health Aide") → Why work here (`Section` light, culture cards) → Open roles (`Section` dark: if `siteConfig.positions.length === 0`, honest empty state "We're not posting specific roles right now — send us your info and we'll reach out." — never fabricate a job) → How to apply (`Section` light: reuse `LeadForm` — it has a "Work with us" tab → `jobsEmail`; render `<LeadForm />` here) → Bilingual welcome (`Section` dark) → CtaBand.

**Test asserts:** `<h1>`; the open-roles empty-state text; the LeadForm renders (a form field or the "Work with us" tab).

**Commit:** `feat: add /careers page`.

---

### Task 9: /refer

**Files:** Create `app/[locale]/refer/page.tsx`; keys under `refer`; Test `tests/pages/refer.test.tsx`.

**Sections:** Hero (eyebrow "For providers", `<h1>` e.g. "Refer a patient in minutes.") → Two ways to refer (`Section` light, 2 cards: Call intake `phoneHref`; Fax `(281) 646-9757`) → What happens next (`Section` dark, 5-step list: we contact within one business day → verify benefits → plan of care with the physician → first visit → progress notes shared) → Who can refer (`Section` light, cards: physicians, discharge planners, case managers, families) → CtaBand. **No PHI collected on-page.**

**Test asserts:** `<h1>`; the fax number; a "what happens next" step.

**Commit:** `feat: add /refer page`.

---

### Task 10: /contact

**Files:** Create `app/[locale]/contact/page.tsx`; keys under `contact`; Test `tests/pages/contact.test.tsx`.

**Sections:** Hero (eyebrow "Contact", `<h1>`) → Details + map (`Section` light, 2-col: contact `Card`s — phone, fax, `intakeEmail`, address, hours — and a Google Maps `<iframe>` for "434 Park Grove Dr, Katy, TX 77450" with `title` attr + `loading="lazy"`) → `#contact` `Section` with `<LeadForm />` → CtaBand.

**Test asserts:** `<h1>`; the phone number; the address; the LeadForm renders.

> The Google Maps iframe `src` uses the public embed form `https://www.google.com/maps?q=434+Park+Grove+Dr,+Katy,+TX+77450&output=embed`. Give it a descriptive `title`.

**Commit:** `feat: add /contact page`.

---

### Task 11: /remote-patient-monitoring

**Files:** Create `app/[locale]/remote-patient-monitoring/page.tsx`; keys under `rpm`; Test `tests/pages/rpm.test.tsx`.

**Sections:** Hero (eyebrow "Remote Patient Monitoring" + a small "New" badge, `<h1>`) → Advantages grid (`Section` light, 6 cards: catch changes early · fewer ER trips · stay safely at home · care team watching daily · peace of mind for family · steadier chronic-condition control) → Who it helps (`Section` dark: chronic conditions, just home from hospital, living alone, post-surgery) → Coverage (`Section` light — HEDGED: "often covered by Medicare; may be available through Texas Medicaid and certain programs; we verify your benefits at no cost and no obligation." No invented figures/programs) → CtaBand.

**Test asserts:** `<h1>`; the "New" badge text; an advantage; that the coverage copy contains a hedge word ("verify" or "may").

**Commit:** `feat: add /remote-patient-monitoring page`.

---

### Task 12: /accessibility

**Files:** Create `app/[locale]/accessibility/page.tsx`; keys under `accessibility`; Test `tests/pages/accessibility.test.tsx`.

**Sections:** Hero (eyebrow "Accessibility", `<h1>` "Care that's open to everyone.") → Our commitment (`Section` light: WCAG 2.1 AA) → What we've done (`Section` dark: semantic structure, keyboard operability, color contrast, reduced-motion support, alt text) → Contact us about access (`Section` light: `intakeEmail` + phone) → CtaBand.

**Test asserts:** `<h1>`; "WCAG"; the contact email.

**Commit:** `feat: add /accessibility page`.

---

## Task 13: Full green gate + nav/route verification

**Files:** none (verification + any fixes)

- [ ] **Step 1: Remove iCloud conflict copies**

```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
find . -path ./node_modules -prune -o \( -name "* [0-9].ts" -o -name "* [0-9].tsx" -o -name "* [0-9].json" \) -print -delete
```

- [ ] **Step 2: Message-key parity check**

Run this to confirm `en.json` and `es.json` have identical key shapes (prints nothing if OK):
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
node -e "const en=require('./messages/en.json'),es=require('./messages/es.json');const flat=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v?flat(v,p+k+'.'):[p+k]);const a=new Set(flat(en)),b=new Set(flat(es));const miss=[...a].filter(k=>!b.has(k)),extra=[...b].filter(k=>!a.has(k));if(miss.length)console.log('MISSING in es:',miss);if(extra.length)console.log('EXTRA in es:',extra);if(!miss.length&&!extra.length)console.log('PARITY OK');"
```
Expected: `PARITY OK`. Fix any mismatch before proceeding.

- [ ] **Step 3: Typecheck, lint, test, build**

```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
npm run typecheck && npm run lint && npm run test && npm run build
```
Expected: all clean; build generates `/`, `/en`, `/es`, and all 8 new routes under each locale. Fix any failures.

- [ ] **Step 4: Route smoke check**

Start the dev server, then for each route confirm HTTP 200 at both `/` and `/es`:
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
for r in "" services about service-area careers refer contact remote-patient-monitoring accessibility; do
  for p in "" es/; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$p$r"); echo "/$p$r -> $code";
  done
done
```
Expected: all `200`. (Note the actual dev port if 3000 is busy.) Stop the dev server after.

- [ ] **Step 5: Nav completeness**

Confirm `components/Nav.tsx` links resolve to all built routes (Services, Service Area, About, Careers, Refer, Contact) and that Refer/Contact CTAs work. Fix any dead links.

- [ ] **Step 6: Commit any fixes**

```bash
git add -A && git commit -m "chore: green gate — full English site builds, routes 200, key parity"
```

---

## Definition of done (Plan 2)

- Home page fully built (no stubs); 8 new pages live under `[locale]`, each with a single `<h1>` Hero and a closing `CtaBand`.
- All copy authored to the voice + compliance rules, read from messages; `en.json`/`es.json` at key parity.
- `ServiceMap` + `CtaBand` + content data model in place; `LeadForm` reused on Careers + Contact.
- `typecheck` + `lint` + `test` + `build` green; every route returns 200 under `/` and `/es`.
- Honest empty states for testimonials + open roles; RPM/insurance coverage hedged; single phone line throughout.

**Next:** Plan 3 — SEO (metadata, sitemap, robots, OG image, JSON-LD, hreflang) + a11y/perf QA (incl. the CTA contrast tune-up), then deployment (phase-0 HANDOFF Task 19).
