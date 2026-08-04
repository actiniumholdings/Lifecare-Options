# Two-Pillar Redesign — Plan 2: Home Two-Pillar Reframe

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the flagship home (`app/[locale]/page.tsx` + `components/home/*`) around the two true service pillars — Skilled Home Health and Provider Attendant Services — using the Plan 1 primitives, and remove the dead pre-flagship home code.

**Architecture:** The live home is `app/[locale]/page.tsx`, which composes `components/home/*` (Hero → TrustBand → Pillars → HowItWorks → WhyLifecare → PhotoBand → ServiceAreaTeaser → CareersTeaser → FinalCTA). This plan rewrites the `Pillars` and `HowItWorks` sections to consume the canonical `PillarCard`/`StepList` primitives, extends `TrustBand`/`CareersTeaser` copy to acknowledge the attendant line, and deletes the dead `app/[locale]/HomeContent.tsx` + its test.

**Tech Stack:** Next.js 16 (App Router) — read `node_modules/next/dist/docs/` before coding per repo `AGENTS.md`. Tailwind v4, `motion/react`, next-intl v4, vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-07-02-two-pillar-redesign-design.md` §6 Home.
**Builds on:** Plan 1 (branch `feat/two-pillar-redesign`) — primitives `components/ui/PillarCard.tsx`, `components/ui/StepList.tsx`, `components/ui/PayerList.tsx` already exist and are tested.

## Global Constraints

- Branch `feat/two-pillar-redesign` in the worktree `~/Documents/Claude/Projects/lifecare-full-site`. Never touch the phase-0 checkout.
- **English-only (user decision 2026-07-02):** Spanish is deferred. The home components already hardcode English copy — keep that pattern; do NOT externalize to `es.json` in this plan. Do not add ES parity work.
- **Keep "14 years serving Katy" (user decision):** do not change the years stat. (The `/about` "since 2008" reconciliation is a Plan 4 concern, not this plan.)
- **PAS payer claims (spec §3):** Medicaid PHC/CAS/FC + STAR+PLUS + private pay only. NO Medicare for attendant care, NO LTC-insurance/VA claims, no outcome guarantees.
- Pillar deep-links target the FINAL routes `/services/skilled` and `/services/attendant`. Those pages are built in Plan 3 — on this dev branch they 404 until then, which is acceptable pre-launch (no live deploy). Do NOT point them at `/services` as a workaround.
- Every task ends green: `npm run typecheck && npm run lint && npm test` pass before its commit. Full suite is 166/166 at plan start.
- Copy rules (spec §7): no AI clichés ("Built by X for Y", hollow buzzwords), no em-dash tics beyond existing style, no unverifiable claims.
- iCloud gotcha: `find .next -name '* 2.*' -delete` if tsc chokes.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Reframe the Pillars section into two true service lines

Replace the home's inline `PillarCard`/`CheckMark`/`ArrowIcon` (a local duplicate) and the "Skilled Clinical Care / Support & Daily Living" framing with the canonical `components/ui/PillarCard` primitive rendering the two real pillars.

**Files:**
- Modify: `components/home/Pillars.tsx` (full rewrite of data + render; drop the inline card)
- Test: `tests/pages/home-sections.test.tsx` is DEAD (deleted in Task 5). Add coverage in a new `tests/home-pillars.test.tsx`.

**Interfaces:**
- Consumes: `PillarCard` from `@/components/ui/PillarCard` (props: `eyebrow, title, description, services[], payerHint, href, cta`), `Section`, `Stagger`, `FadeUp`.

- [ ] **Step 1: Write the failing test**

Create `tests/home-pillars.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pillars } from "@/components/home/Pillars";

describe("Home Pillars — two service lines", () => {
  it("renders both pillars linking to their dedicated pages", () => {
    render(<Pillars />);
    expect(
      screen.getByRole("heading", { name: /skilled home health/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /provider attendant services/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore skilled/i })).toHaveAttribute(
      "href",
      "/services/skilled"
    );
    expect(screen.getByRole("link", { name: /explore attendant/i })).toHaveAttribute(
      "href",
      "/services/attendant"
    );
  });

  it("shows attendant payers without claiming Medicare for attendant care", () => {
    render(<Pillars />);
    // The attendant payer hint names Medicaid programs + private pay, never Medicare.
    const attendantPayers = screen.getByText(/PHC.*CAS.*FC/i);
    expect(attendantPayers).toBeInTheDocument();
    expect(attendantPayers.textContent).not.toMatch(/medicare/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/home-pillars.test.tsx`
Expected: FAIL — headings "Provider Attendant Services" not found (still the old framing).

- [ ] **Step 3: Rewrite `components/home/Pillars.tsx`**

```tsx
import { Section } from "@/components/ui/Section";
import { PillarCard } from "@/components/ui/PillarCard";
import { Stagger } from "@/components/motion/Stagger";
import { FadeUp } from "@/components/motion/FadeUp";

/**
 * Lifecare's two service lines, presented as equal pillars (spec §6 Home).
 * Skilled Home Health = the Medicare-certified clinical benefit; Provider
 * Attendant Services = the Medicaid/private-pay daily-living line. Each links
 * to its dedicated page (built in Plan 3).
 */
const PILLARS = [
  {
    eyebrow: "Medicare-certified",
    title: "Skilled Home Health",
    description:
      "Licensed clinicians bring hospital-grade skill into the home — nursing, therapy, and medical social work coordinated with your physician.",
    services: [
      "Skilled Nursing",
      "Physical, Occupational & Speech Therapy",
      "Medical Social Work",
      "Home Health Aide",
      "Remote Patient Monitoring",
    ],
    payerHint: "Medicare · Medicare Advantage · commercial plans",
    href: "/services/skilled",
    cta: "Explore skilled care",
  },
  {
    eyebrow: "Medicaid · Private pay",
    title: "Provider Attendant Services",
    description:
      "Trained attendants help with the everyday tasks that keep daily life safe, dignified, and independent at home.",
    services: [
      "Bathing, dressing & grooming",
      "Meal preparation",
      "Light housekeeping & laundry",
      "Errands & escort to appointments",
    ],
    payerHint: "Medicaid (PHC · CAS · FC) · STAR+PLUS · private pay",
    href: "/services/attendant",
    cta: "Explore attendant care",
  },
] as const;

export function Pillars() {
  return (
    <Section
      tone="light"
      eyebrow="What We Do"
      title="Two ways we bring care home"
      intro="Whether the need is clinical recovery or everyday support, Lifecare meets it at home — with the right professional at the right time."
    >
      <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.12}>
        {PILLARS.map((p) => (
          <FadeUp as="div" key={p.title} className="h-full">
            <PillarCard {...p} services={[...p.services]} />
          </FadeUp>
        ))}
      </Stagger>
    </Section>
  );
}

export default Pillars;
```

(The `services={[...p.services]}` spread widens the `readonly` tuple to `string[]` for the prop; keep it.)

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/home-pillars.test.tsx && npm run typecheck`
Expected: PASS / clean.

- [ ] **Step 5: Commit**

```bash
git add components/home/Pillars.tsx tests/home-pillars.test.tsx
git commit -m "feat(home): reframe Pillars into Skilled HH + Provider Attendant Services

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Swap HowItWorks onto StepList with dual-audience copy

Use the canonical `StepList` primitive and adjust copy so the 1-2-3 works for BOTH a hospital-discharge family and a Medicaid attendant-care family (spec §6 Home).

**Files:**
- Modify: `components/home/HowItWorks.tsx`
- Test: `tests/home-how-it-works.test.tsx` (new)

**Interfaces:**
- Consumes: `StepList` from `@/components/ui/StepList` (`{ steps: {title, body}[], tone? }`), `Section`.

- [ ] **Step 1: Write the failing test**

Create `tests/home-how-it-works.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "@/components/home/HowItWorks";

describe("Home HowItWorks", () => {
  it("renders three ordered steps via the StepList primitive", () => {
    render(<HowItWorks />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(/we listen/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/home-how-it-works.test.tsx`
Expected: FAIL — no `<ol>` (current markup is a `Stagger` grid of `<article>`s).

- [ ] **Step 3: Rewrite `components/home/HowItWorks.tsx`**

```tsx
import { Section } from "@/components/ui/Section";
import { StepList } from "@/components/ui/StepList";

const STEPS = [
  {
    title: "We listen",
    body: "A care coordinator answers, learns the situation, and helps you understand which kind of care fits — skilled recovery, everyday attendant support, or both.",
  },
  {
    title: "We coordinate",
    body: "We check coverage — Medicare, Medicaid, or private pay — connect with any physician involved, and arrange an in-home assessment, handling the paperwork so your family doesn't have to.",
  },
  {
    title: "Care begins at home",
    body: "The right professional starts a personalized plan of care, with ongoing oversight and a team you can reach whenever you need us.",
  },
];

/**
 * Reassuring 3-step explainer for first-time callers, spanning both service
 * lines (spec §6 Home). Uses the canonical StepList primitive.
 */
export function HowItWorks() {
  return (
    <Section
      tone="light"
      eyebrow="What to Expect"
      title="When you call, here's what happens"
      intro="Reaching out shouldn't feel daunting. The first call is simple, human, and pressure-free."
    >
      <StepList steps={STEPS} />
    </Section>
  );
}

export default HowItWorks;
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/home-how-it-works.test.tsx && npm run typecheck`
Expected: PASS / clean.

- [ ] **Step 5: Commit**

```bash
git add components/home/HowItWorks.tsx tests/home-how-it-works.test.tsx
git commit -m "feat(home): HowItWorks on StepList, dual-audience (skilled + attendant) copy

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Extend TrustBand framing to acknowledge attendant care

Keep all stats (including "14 years serving Katy") and the navy design. Only broaden the framing sentence so the band no longer reads as skilled-only.

**Files:**
- Modify: `components/home/TrustBand.tsx` (copy only — the framing `<p>` around line 122-132; do NOT touch `parseStat`/`CountStat` or the stats array)
- Test: `tests/home-trustband.test.tsx` (new)

- [ ] **Step 1: Read the current framing copy**

Read `components/home/TrustBand.tsx` lines ~118-135. Confirm the `years` value source (keep whatever yields 14 — do not change it). The framing currently says "Trusted, accountable care across Katy & West Houston" + a licensing sentence.

- [ ] **Step 2: Write the failing test**

Create `tests/home-trustband.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBand } from "@/components/home/TrustBand";

describe("Home TrustBand", () => {
  it("keeps the 14-years stat and names both service lines in the framing", () => {
    render(<TrustBand />);
    expect(screen.getByText(/years serving katy/i)).toBeInTheDocument();
    // framing acknowledges skilled + attendant, not skilled-only
    expect(screen.getByText(/skilled home health and attendant/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/home-trustband.test.tsx`
Expected: FAIL — the "skilled home health and attendant" phrasing isn't present yet.

- [ ] **Step 4: Update the framing sentence**

In `components/home/TrustBand.tsx`, change the supporting framing paragraph (the `text-white/65` sentence beneath the "Trusted, accountable care…" headline) to name both lines. Example (adapt to the exact existing sentence, preserving the license-number interpolation):

```tsx
Skilled home health and attendant services, coordinated with your physician
and your family{siteConfig.stateLicense
  ? `, Texas License Number ${siteConfig.stateLicense}.`
  : "."} Every step of the way.
```

Do not alter the stats array or the count-up logic.

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run tests/home-trustband.test.tsx && npm run typecheck && npm run lint`
Expected: PASS / clean.

- [ ] **Step 6: Commit**

```bash
git add components/home/TrustBand.tsx tests/home-trustband.test.tsx
git commit -m "feat(home): TrustBand framing names both service lines (keeps 14-yr stat)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: CareersTeaser — hiring nurses AND attendants

Broaden the home careers teaser so it recruits for both lines (attendant recruiting is half the industry's hiring). Copy-only; keep the layout, card, and `/careers` link.

**Files:**
- Modify: `components/home/CareersTeaser.tsx` (copy only)
- Test: `tests/home-careers-teaser.test.tsx` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/home-careers-teaser.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/home-careers-teaser.test.tsx`
Expected: FAIL — current copy mentions clinicians only, no "attendant".

- [ ] **Step 3: Update the copy**

Read `components/home/CareersTeaser.tsx`. Update its headline/body so it names both audiences, e.g. body: "We're hiring nurses, therapists, and attendants across the Katy area. If you believe great care belongs at home, we'd love to meet you." Keep the existing `/careers` CTA link and layout. Do not restyle.

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/home-careers-teaser.test.tsx && npm run typecheck`
Expected: PASS / clean.

- [ ] **Step 5: Commit**

```bash
git add components/home/CareersTeaser.tsx tests/home-careers-teaser.test.tsx
git commit -m "feat(home): CareersTeaser recruits attendants alongside clinicians

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Delete dead pre-flagship home code

`app/[locale]/HomeContent.tsx` and `tests/pages/home-sections.test.tsx` test a home tree the live `app/[locale]/page.tsx` no longer references (confirmed during Plan 1). Remove them so there's one home.

**Files:**
- Delete: `app/[locale]/HomeContent.tsx`, `tests/pages/home-sections.test.tsx`

- [ ] **Step 1: Confirm they're dead**

Run: `grep -rn "HomeContent" app components tests`
Expected: references ONLY within `HomeContent.tsx` itself and `tests/pages/home-sections.test.tsx` — NOT from `app/[locale]/page.tsx` or any live route. If any live file imports it, STOP and report.

- [ ] **Step 2: Delete**

```bash
git rm app/[locale]/HomeContent.tsx tests/pages/home-sections.test.tsx
```

- [ ] **Step 3: Verify green**

Run: `npm run typecheck && npm run lint && npm test`
Expected: clean; test count drops by the deleted file's cases but 0 failures.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(home): delete dead pre-flagship HomeContent + its test

The live home is app/[locale]/page.tsx composing components/home/*;
HomeContent.tsx was an unreferenced duplicate.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Green gate + visual review

**Files:** none (verification only)

- [ ] **Step 1: Full gate**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all pass. (iCloud gotcha applies.)

- [ ] **Step 2: Visual review**

With the dev server running, screenshot the home `/` at 1440px and 390px. Confirm:
- the two-pillar section shows Skilled Home Health + Provider Attendant Services PillarCards with payer hints and working "Explore" links (the linked pages 404 on this branch until Plan 3 — expected);
- HowItWorks renders as a numbered StepList;
- TrustBand still shows 14 years and now reads as covering both lines;
- no visual regressions elsewhere.

- [ ] **Step 3: Commit the gate**

```bash
git commit --allow-empty -m "chore: Plan 2 green gate — home two-pillar reframe verified

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Deliberate deviation from spec §6 Home

Spec §6 Home item 7 lists "Final CTA band + **LeadForm**". The flagship home
instead ends with `FinalCTA` (Refer a Patient → `/refer`, Contact Us →
`/contact`, plus the phone), with the actual lead form living on the dedicated
`/refer` and `/contact` pages. This plan keeps the FinalCTA-only pattern (a
cleaner home; dedicated conversion pages hold the form) rather than embedding a
LeadForm on the home. Flagged for the user's confirmation before execution.

## Follow-on plans

- **Plan 3 — Services hub + pillar pages:** `/services` router, `/services/skilled`, `/services/attendant` (new attendant page: task grid, two-path eligibility, careers cross-link), nav Services dropdown. Resolves the pillar deep-link 404s.
- **Plan 4 — Remaining pages:** about (reconcile the "14 years" vs "since 2008" copy here), careers (two audiences), service-area, refer, contact, RPM, accessibility.
- **Plan 5 — SEO + final gates:** metadata/JSON-LD for new routes, sitemap, contrast audit, screenshot matrix.
- **Deferred:** Spanish (ES) parity across the whole site — the home components hardcode English; a dedicated i18n pass externalizes all copy to `es.json`.
