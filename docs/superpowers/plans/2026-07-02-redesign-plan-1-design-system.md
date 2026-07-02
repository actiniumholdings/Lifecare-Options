# Two-Pillar Redesign — Plan 1: Design System & Readability Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the single canonical design system (type scale, tokens, Button/Section/Hero variants, new PillarCard/StepList/PayerList primitives) that every page rebuild in Plans 2–4 consumes, and structurally fix the site-wide readability regression.

**Architecture:** Tokens and a global type scale live in `app/globals.css` (Tailwind v4 `@theme` + `@layer base` + `@utility`). Shared primitives live in `components/ui/`. Base heading sizes in the CSS layer make an unstyled `h1` readable by default; components then opt into explicit scale utilities. Legacy `mist`/`amber` tokens are **kept temporarily** (inner pages still reference them until Plans 3–4 rebuild those pages); the final cleanup plan deletes them.

**Tech Stack:** Next.js 16 (App Router, Turbopack) — **read `node_modules/next/dist/docs/` before writing code, per repo `AGENTS.md`**. Tailwind v4 (CSS-first config), `motion/react`, next-intl v4, vitest + @testing-library/react + vitest-axe.

**Spec:** `docs/superpowers/specs/2026-07-02-two-pillar-redesign-design.md`

## Global Constraints

- Work happens in `~/Documents/Claude/Projects/lifecare-full-site` on branch `feat/two-pillar-redesign`. Never touch the main checkout (phase-0 WIP).
- Every task ends green: `npm run typecheck && npm run lint && npm test` pass before its commit.
- Color roles (spec §5): `blue-deep #2F5F8A` = accent text on light + primary CTA fill; `blue-light #7AA6CF` = accent text on navy; `care-blue #5A8BB8` = decorative only, never small text; new `sky-soft #EAF2F9` = alternating light-section background.
- Amber is banned in NEW code. Existing amber consumers (CtaBand, ServiceMap, ServicesList, Card, opengraph-image, RpmContent) are rebuilt in later plans — do not restyle them here.
- All copy in components arrives via props — no hardcoded English strings in `components/ui/` (EN/ES parity is handled at page level).
- iCloud gotcha: if `tsc` fails on phantom `* 2.ts` files under `.next`, delete them: `find .next -name '* 2.*' -delete`.
- Commits end with: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Type scale + sky token in globals.css

The tiny-h1 bug exists because `components/ui/Hero.tsx` renders `<h1 className="mt-3 text-navy">` with no size class and no base style supplies one. Fix structurally: base heading sizes in `@layer base`, explicit scale utilities for components, and the `sky-soft` token.

**Files:**

- Modify: `app/globals.css`
- Test: `tests/theme.test.tsx` (extend existing file)

**Interfaces:**

- Produces: utilities `text-display-xl`, `text-display`, `text-title`, `text-caption`; color token `sky-soft` (usable as `bg-sky-soft`); readable default sizes for bare `h1`–`h4`. All later tasks use these class names verbatim.

- [ ] **Step 1: Write the failing test**

Append to `tests/theme.test.tsx`:

```tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
```

(If `tests/theme.test.tsx` has no `describe` import, it uses vitest globals — match the file's existing style when appending.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/theme.test.tsx`
Expected: FAIL — `--color-sky-soft` not found.

- [ ] **Step 3: Implement in `app/globals.css`**

Inside the existing `@theme` block, after `--color-mist`, add:

```css
  /* Alternating light-section background (spec §5 Color). */
  --color-sky-soft: #EAF2F9;
```

After the `@theme` block, add the scale utilities and base heading sizes:

```css
/* ——— Type scale (spec §5 Type) ———
   Components opt in via these utilities; the @layer base rules below are
   the safety net that makes a bare heading readable, so the 16px-h1
   regression class of bug is structurally impossible. */
@utility text-display-xl {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
@utility text-display {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
}
@utility text-title {
  font-size: 1.75rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
@utility text-caption {
  font-size: 0.8125rem;
  line-height: 1.4;
}

@layer base {
  h1 { font-size: clamp(2.25rem, 4.5vw, 3.5rem); line-height: 1.08; letter-spacing: -0.02em; }
  h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.12; letter-spacing: -0.015em; }
  h3 { font-size: 1.375rem; line-height: 1.25; }
  h4 { font-size: 1.125rem; line-height: 1.3; }
}
```

Also move the existing `h1,h2,h3,h4 { font-family/color }` rule INTO the same `@layer base` block (unlayered element rules beat layered utilities in the cascade; everything base-level must live in the base layer so page-level utility classes can override).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/theme.test.tsx`
Expected: PASS (all cases, including pre-existing ones).

- [ ] **Step 5: Visual sanity check**

Run: `npm run dev` (or use the already-running server), open `http://localhost:3000/services`.
Expected: "Skilled care, brought home." now renders as a large display headline (base h1 rule), not 16px.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tests/theme.test.tsx
git commit -m "feat(ds): add type scale, base heading sizes, and sky-soft token

Bare headings now have readable defaults — the 16px-h1 regression is
structurally impossible.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Button — retire amber, add onDark variant

**Files:**

- Modify: `components/Button.tsx`
- Test: `tests/Button.test.tsx` (existing)

**Interfaces:**

- Consumes: tokens from Task 1 (no new ones needed).
- Produces: `ButtonVariant = "primary" | "secondary" | "onDark" | "tertiary"`. `secondary` = white outline card-style (light backgrounds); `onDark` = inverted white fill (navy bands). Props otherwise unchanged; all existing call sites keep compiling.

- [ ] **Step 1: Update the test**

In `tests/Button.test.tsx`, replace any assertion that `secondary` renders `bg-amber` with:

```tsx
it("secondary variant is an outlined button, not amber", () => {
  render(<Button variant="secondary">Call</Button>);
  const btn = screen.getByRole("button", { name: "Call" });
  expect(btn.className).toContain("border");
  expect(btn.className).toContain("bg-white");
  expect(btn.className).not.toContain("amber");
});

it("onDark variant renders an inverted white button for navy bands", () => {
  render(<Button variant="onDark">Refer a Patient</Button>);
  const btn = screen.getByRole("button", { name: "Refer a Patient" });
  expect(btn.className).toContain("bg-white");
  expect(btn.className).toContain("text-navy");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/Button.test.tsx`
Expected: FAIL — secondary still amber; `onDark` not a valid variant (type error at compile).

- [ ] **Step 3: Implement**

In `components/Button.tsx`:

```ts
type ButtonVariant = "primary" | "secondary" | "onDark" | "tertiary";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-blue-deep text-white hover:bg-navy rounded-xl",
  secondary:
    "border border-navy/25 bg-white text-navy hover:border-blue-deep hover:text-blue-deep rounded-xl",
  onDark: "bg-white text-navy hover:bg-blue-light hover:text-navy-deep rounded-xl",
  tertiary:
    "bg-transparent text-blue-deep hover:text-navy underline-offset-4 hover:underline",
};
```

No other changes — `tapScale`, sizes, link/button split all stay.

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/Button.test.tsx && npm run typecheck`
Expected: PASS / no type errors (existing `variant="secondary"` call sites still compile; they now render outlined).

- [ ] **Step 5: Commit**

```bash
git add components/Button.tsx tests/Button.test.tsx
git commit -m "feat(ds): retire amber secondary Button; add onDark variant

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Section — add sky tone

**Files:**

- Modify: `components/ui/Section.tsx`
- Test: `tests/ui/section.test.tsx` (existing)

**Interfaces:**

- Consumes: `bg-sky-soft` token (Task 1).
- Produces: `SectionTone = "light" | "sky" | "dark"`. `sky` behaves like `light` for all text-color decisions (eyebrow tone, heading color, intro color) — only the background differs. Later plans compose pages as ivory → sky → navy bands.

- [ ] **Step 1: Write the failing test**

Append to `tests/ui/section.test.tsx` (match the file's existing render helpers):

```tsx
it("sky tone renders the sky-soft background with navy text", () => {
  const { container } = render(
    <Section tone="sky" eyebrow="Eyebrow" title="Title" intro="Intro" />
  );
  const section = container.querySelector("section")!;
  expect(section.className).toContain("bg-sky-soft");
  expect(section.className).toContain("text-navy");
  // heading stays navy (light-tone treatment), never white
  expect(container.querySelector("h2")!.className).toContain("text-navy");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/section.test.tsx`
Expected: FAIL — `"sky"` not assignable to `SectionTone`.

- [ ] **Step 3: Implement**

In `components/ui/Section.tsx`:

```ts
export type SectionTone = "light" | "sky" | "dark";
```

```ts
const isDark = tone === "dark";
const toneClasses = isDark
  ? "bg-navy text-white"
  : tone === "sky"
    ? "bg-sky-soft text-navy"
    : "bg-canvas text-navy";
```

Then replace every `tone === "dark"` ternary in the header (h2 color, intro color, `Eyebrow tone`) with `isDark`, so `sky` inherits the light-tone text treatment automatically. Pass `tone={isDark ? "dark" : "light"}` to `Eyebrow` (its type stays two-valued).

Also swap the header h2's ad-hoc size classes for the Task 1 scale — replace `text-3xl … sm:text-4xl lg:text-5xl` with `text-display` (spec §5: components consume the single type scale, no ad-hoc heading sizes):

```tsx
<h2
  className={`font-display text-display font-semibold text-balance ${
    isDark ? "text-white" : "text-navy"
  } ${centered ? "max-w-3xl" : "max-w-2xl"} ${align}`}
>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Section.tsx tests/ui/section.test.tsx
git commit -m "feat(ds): add sky Section tone for alternating light bands

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Interior Hero — rewrite with type scale, real imagery, no empty-gradient state

**Files:**

- Modify: `components/ui/Hero.tsx` (full rewrite of the section element; same export name)
- Test: `tests/ui/hero.test.tsx` (existing — extend/replace assertions)

**Interfaces:**

- Consumes: `text-display-xl` (Task 1), `Button` variants (Task 2), `Eyebrow`, `Container`.
- Produces (breaking, intentional — inner pages are rebuilt against this in Plans 3–4):

```ts
export interface InteriorHeroProps {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  photoSrc: string;        // REQUIRED — no gradient-only fallback exists anymore
  photoAlt: string;        // REQUIRED — empty string allowed only for decorative
  badges?: { label: string; icon?: ReactNode }[];
}
export function Hero(props: InteriorHeroProps): JSX.Element;
```

- [ ] **Step 1: Write the failing tests**

Replace the body of `tests/ui/hero.test.tsx` assertions with (keep the file's imports/setup):

```tsx
const baseProps = {
  eyebrow: "Our Services",
  headline: "Skilled care, brought home.",
  intro: "Our team comes to you.",
  photoSrc: "/images/hero-care.jpg",
  photoAlt: "A nurse checks a patient's blood pressure at home.",
};

it("renders the headline at display scale", () => {
  const { container } = render(<Hero {...baseProps} />);
  const h1 = container.querySelector("h1")!;
  expect(h1.textContent).toBe("Skilled care, brought home.");
  expect(h1.className).toContain("text-display-xl");
});

it("always renders the photo — no empty gradient panel", () => {
  render(<Hero {...baseProps} />);
  const img = screen.getByRole("img", {
    name: "A nurse checks a patient's blood pressure at home.",
  });
  expect(img).toBeInTheDocument();
});

it("sits on the sky-soft band, not legacy mist", () => {
  const { container } = render(<Hero {...baseProps} />);
  expect(container.querySelector("section")!.className).toContain("bg-sky-soft");
  expect(container.querySelector("section")!.className).not.toContain("mist");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/ui/hero.test.tsx`
Expected: FAIL — no `text-display-xl`, `bg-mist` still present, TS error on required `photoSrc`.

- [ ] **Step 3: Rewrite `components/ui/Hero.tsx`**

```tsx
import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };
type Badge = { label: string; icon?: ReactNode };

export interface InteriorHeroProps {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Required — interior heroes always carry a real photograph. */
  photoSrc: string;
  photoAlt: string;
  badges?: Badge[];
}

/**
 * Interior-page hero (spec §5): compact photo treatment on the sky band.
 * The home flagship hero lives in components/home/Hero.tsx — this one is
 * for the 10 interior routes.
 */
export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
  photoSrc,
  photoAlt,
  badges,
}: InteriorHeroProps) {
  return (
    <section className="bg-sky-soft px-4 py-14 md:px-8 md:py-20">
      <Container className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-navy text-balance">
            {headline}
          </h1>
          {intro && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">{intro}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Button href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="secondary" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          {badges && badges.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-navy shadow-md"
                >
                  {badge.icon && <span aria-hidden>{badge.icon}</span>}
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Fix compile fallout, run tests**

Run: `npm run typecheck`
Expected: errors ONLY in inner-page content files that call `<Hero>` without `photoSrc` (e.g. `ServicesContent.tsx`, `AboutContent.tsx`, …). For each, add an interim real image so the site stays green until that page's rebuild:
`photoSrc="/images/hero-care.jpg"` + a truthful `photoAlt` (e.g. `"A Lifecare nurse takes a seated patient's blood pressure at home."`). Do NOT restyle those pages otherwise.

Run: `npx vitest run tests/ui/hero.test.tsx && npm test`
Expected: PASS (page smoke tests may need the same prop fix inside their render helpers).

- [ ] **Step 5: Visual check**

Open `http://localhost:3000/services` — hero shows a real photo (no gradient void) and a display-scale headline on the sky band.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Hero.tsx tests/ui/hero.test.tsx app/\[locale\]
git commit -m "feat(ds): rewrite interior Hero — display-scale h1, required photo, sky band

Kills the empty-gradient hero panel and the 16px interior h1s.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: PillarCard primitive

**Files:**

- Create: `components/ui/PillarCard.tsx`
- Test: `tests/ui/pillar-card.test.tsx`

**Interfaces:**

- Consumes: `text-title` utility (Task 1).
- Produces:

```ts
export interface PillarCardProps {
  eyebrow: string;      // "MEDICARE-CERTIFIED" / "MEDICAID · PRIVATE PAY"
  title: string;        // "Skilled Home Health"
  description: string;
  services: string[];   // rendered as a check-list
  payerHint: string;    // "Medicare · Medicare Advantage · commercial plans"
  href: string;         // pillar page deep link
  cta: string;          // "Explore skilled care"
}
export function PillarCard(props: PillarCardProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**

Create `tests/ui/pillar-card.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PillarCard } from "@/components/ui/PillarCard";

const props = {
  eyebrow: "Medicare-certified",
  title: "Skilled Home Health",
  description: "Licensed clinicians bring hospital-grade skill into the home.",
  services: ["Skilled Nursing", "Physical Therapy"],
  payerHint: "Medicare · Medicare Advantage · commercial plans",
  href: "/services/skilled",
  cta: "Explore skilled care",
};

describe("PillarCard", () => {
  it("renders title at title scale with all service items", () => {
    render(<PillarCard {...props} />);
    const heading = screen.getByRole("heading", { name: "Skilled Home Health" });
    expect(heading.className).toContain("text-title");
    for (const s of props.services) expect(screen.getByText(s)).toBeInTheDocument();
  });

  it("links to the pillar page and shows the payer hint", () => {
    render(<PillarCard {...props} />);
    expect(screen.getByRole("link", { name: /explore skilled care/i })).toHaveAttribute(
      "href",
      "/services/skilled"
    );
    expect(screen.getByText(props.payerHint)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/pillar-card.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/ui/PillarCard.tsx`**

```tsx
import Link from "next/link";
import { Eyebrow } from "./Eyebrow";

export interface PillarCardProps {
  eyebrow: string;
  title: string;
  description: string;
  services: string[];
  payerHint: string;
  href: string;
  cta: string;
}

/**
 * One of the two service-line pillars (spec §6 Home / Services hub).
 * White card, hairline border, blue top rule, check-list, payer caption.
 */
export function PillarCard({
  eyebrow,
  title,
  description,
  services,
  payerHint,
  href,
  cta,
}: PillarCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy/10 border-t-4 border-t-blue-deep bg-card p-8 shadow-sm transition-shadow hover:shadow-lg">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 className="mt-3 font-display text-title font-semibold text-navy">{title}</h3>
      <p className="mt-3 leading-relaxed text-slate">{description}</p>
      <ul className="mt-6 space-y-2.5">
        {services.map((service) => (
          <li key={service} className="flex items-start gap-2.5 text-navy">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="mt-1 h-4 w-4 shrink-0 fill-none stroke-blue-deep stroke-2"
            >
              <path d="M2.5 8.5l3.5 3.5 7-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {service}
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-navy/10 pt-4 text-caption font-medium uppercase tracking-wide text-slate">
        {payerHint}
      </p>
      <Link
        href={href}
        className="group mt-4 inline-flex items-center gap-1.5 font-medium text-blue-deep hover:text-navy"
      >
        {cta}
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/ui/pillar-card.test.tsx && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/PillarCard.tsx tests/ui/pillar-card.test.tsx
git commit -m "feat(ds): add PillarCard primitive for the two service lines

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: StepList primitive

**Files:**

- Create: `components/ui/StepList.tsx`
- Test: `tests/ui/step-list.test.tsx`

**Interfaces:**

- Produces:

```ts
export interface Step { title: string; body: string }
export function StepList({ steps, tone }: { steps: Step[]; tone?: "light" | "dark" }): JSX.Element;
```

Numbered-circle grid (the "When you call, here's what happens" 1-2-3 pattern), reusable on light or dark bands.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/step-list.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepList } from "@/components/ui/StepList";

const steps = [
  { title: "We listen", body: "A care coordinator learns the situation." },
  { title: "We coordinate", body: "We verify coverage and arrange an in-home assessment." },
  { title: "Care begins at home", body: "A licensed professional starts a personalized plan." },
];

describe("StepList", () => {
  it("renders an ordered list with numbered steps", () => {
    render(<StepList steps={steps} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain("1");
    expect(items[0].textContent).toContain("We listen");
    expect(items[2].textContent).toContain("Care begins at home");
  });

  it("dark tone switches text to white", () => {
    render(<StepList steps={steps} tone="dark" />);
    const heading = screen.getByText("We listen");
    expect(heading.className).toContain("text-white");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/step-list.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/ui/StepList.tsx`**

```tsx
export interface Step {
  title: string;
  body: string;
}

/**
 * Numbered 1-2-3 flow (spec §6: "When you call" / "how care starts").
 * Semantic <ol>; connector line between circles on desktop.
 */
export function StepList({
  steps,
  tone = "light",
}: {
  steps: Step[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <ol className="grid gap-10 sm:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-lg font-semibold ${
              dark
                ? "border-blue-light/60 text-blue-light"
                : "border-blue-deep/40 text-blue-deep"
            }`}
          >
            {i + 1}
          </span>
          <h3
            className={`mt-4 font-display text-xl font-semibold ${
              dark ? "text-white" : "text-navy"
            }`}
          >
            {step.title}
          </h3>
          <p className={`mt-2 leading-relaxed ${dark ? "text-white/75" : "text-slate"}`}>
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/ui/step-list.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/StepList.tsx tests/ui/step-list.test.tsx
git commit -m "feat(ds): add StepList primitive for numbered flows

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: PayerList primitive

**Files:**

- Create: `components/ui/PayerList.tsx`
- Test: `tests/ui/payer-list.test.tsx`

**Interfaces:**

- Produces:

```ts
export function PayerList({
  payers,
  note,
  tone,
}: {
  payers: string[];
  note?: string;
  tone?: "light" | "dark";
}): JSX.Element;
```

Chip row used on the services hub, both pillar pages, and home. Chips are readable on BOTH tones by design (this replaces the broken navy-void chips treatment).

- [ ] **Step 1: Write the failing test**

Create `tests/ui/payer-list.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PayerList } from "@/components/ui/PayerList";

const payers = ["Medicare", "Medicaid (PHC · CAS · FC)", "STAR+PLUS plans", "Private pay"];

describe("PayerList", () => {
  it("renders every payer as a list item chip", () => {
    render(<PayerList payers={payers} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("STAR+PLUS plans")).toBeInTheDocument();
  });

  it("dark tone renders white-on-navy readable chips", () => {
    render(<PayerList payers={payers} tone="dark" />);
    const chip = screen.getByText("Medicare");
    expect(chip.className).toContain("text-white");
    expect(chip.className).toContain("border-white/30");
  });

  it("renders the optional note", () => {
    render(<PayerList payers={payers} note="We verify benefits at no cost." />);
    expect(screen.getByText("We verify benefits at no cost.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/payer-list.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/ui/PayerList.tsx`**

```tsx
/**
 * Payer/condition chip row (spec §6). White-bordered chips on dark bands,
 * navy-bordered on light — legible on both by construction.
 */
export function PayerList({
  payers,
  note,
  tone = "light",
}: {
  payers: string[];
  note?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const chip = dark
    ? "border-white/30 bg-white/5 text-white"
    : "border-navy/20 bg-card text-navy";
  return (
    <div>
      <ul className="flex flex-wrap gap-2.5">
        {payers.map((payer) => (
          <li
            key={payer}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${chip}`}
          >
            {payer}
          </li>
        ))}
      </ul>
      {note && (
        <p className={`mt-4 max-w-xl text-sm ${dark ? "text-white/70" : "text-slate"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/ui/payer-list.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/PayerList.tsx tests/ui/payer-list.test.tsx
git commit -m "feat(ds): add PayerList chip primitive, readable on both tones

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Attendant-line imagery

The photo set has clinical scenes (`hero-care.jpg`, `vitals.jpg`, `therapy.jpg`, `coordinator.jpg`, `arrival.jpg`) but nothing depicting non-clinical daily-living care, which the attendant pillar needs (spec §5 Imagery).

**Files:**

- Create: `public/images/attendant-daily.jpg` (≥1600px wide, JPEG quality ~80)

**Interfaces:**

- Produces: `/images/attendant-daily.jpg`, consumed by Plans 2–3 (home pillar card imagery, `/services/attendant` hero).

- [ ] **Step 1: Generate the image**

Use the `/media-gen` skill (Fal.ai pipeline) with this prompt:

> Warm editorial photograph, natural window light, a home caregiver in plain clothes (no scrubs, no stethoscope) helping a smiling elderly man prepare a simple meal at his kitchen counter; homey Texas kitchen, soft depth of field, dignified and unposed, photojournalistic style, muted warm palette.

Constraints: no visible text/logos in frame, no medical equipment (this is the NON-clinical line's visual signature per spec §5).

- [ ] **Step 2: Place and optimize**

Save the chosen output to `public/images/attendant-daily.jpg`. If larger than 500KB, recompress:
`sips -s format jpeg -s formatOptions 80 --resampleWidth 2048 <src> --out public/images/attendant-daily.jpg`

- [ ] **Step 3: Verify build picks it up**

Run: `npm run build`
Expected: build succeeds (image is static — no code references yet; Plans 2–3 wire it).

- [ ] **Step 4: Commit**

```bash
git add public/images/attendant-daily.jpg
git commit -m "feat(assets): add attendant daily-living hero photograph

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Green gate + visual review

**Files:** none (verification only)

- [ ] **Step 1: Full gate**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Expected: all pass. (iCloud gotcha applies — see Global Constraints.)

- [ ] **Step 2: Visual review**

With the dev server running, screenshot `/`, `/services`, `/about` at 1440px and 390px widths. Confirm:

- every h1 renders at display scale on all three pages,
- no empty gradient hero panels,
- no amber buttons anywhere on `/` (inner pages may retain amber in NOT-yet-rebuilt sections — expected until Plans 3–4).

- [ ] **Step 3: Commit the gate**

```bash
git commit --allow-empty -m "chore: Plan 1 green gate — design system foundation verified

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Follow-on plans (written after Plan 1 lands)

- **Plan 2 — Home two-pillar reframe** (spec §6 Home): TrustBand licensing sentence, Pillars section rebuilt on PillarCard, StepList swap, careers teaser copy, EN+ES strings.
- **Plan 3 — Services hub + pillar pages** (spec §6): `/services` router page, `/services/skilled`, `/services/attendant` (new EN+ES copy, two-path eligibility), nav dropdown.
- **Plan 4 — Remaining pages** (spec §6): about, careers (two audiences), service-area, refer, contact, RPM, accessibility.
- **Plan 5 — SEO + final gates** (spec §6 SEO, §9): metadata/hreflang for new routes, JSON-LD `availableService`, sitemap, contrast-audit script, full screenshot matrix, copy pass, legacy-token deletion (mist/amber die here).
