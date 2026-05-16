# Phase 0 Design Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AI-default visual system on the live Phase 0 site with a committed editorial direction (peach-cream surface, Spectral + Albert Sans typography, numbered editorial services list, editorial trust pull-quote, phone-first CTAs), fix a motion-visibility bug that hides content from non-scrolling viewers, and resolve all surgical findings from the impeccable critique.

**Architecture:** Refactor in place on the `phase-0` branch. Two new presentational components (`TrustSentence`, `ServicesList`) replace today's trust strip and services grid. Existing components (AnnouncementBar, Nav, Footer, LeadForm, Button, TrustBadge, Card, motion primitives) get focused updates. Design tokens in `app/globals.css` drive the palette swap. Font loading in `lib/fonts.ts` swaps Playfair + Inter for Spectral + Albert Sans. No new dependencies beyond fonts.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · motion/react · next/font/google · Vitest + Testing Library · TypeScript 5

**Spec:** [docs/superpowers/specs/2026-05-16-phase-0-design-upgrade.md](../specs/2026-05-16-phase-0-design-upgrade.md)

---

## File Structure

**New files:**
- `components/TrustSentence.tsx` — editorial pull-quote credentials line
- `components/ServicesList.tsx` — numbered editorial services list + RPM "Now offering" ribbon

**Modified files:**
- `lib/fonts.ts` — Spectral + Albert Sans (drop Playfair + Inter)
- `lib/site-config.ts` — handle TBD CCN/license gracefully
- `app/globals.css` — new tokens, body bg, default heading + body font families
- `app/layout.tsx` — font variable classes
- `app/page.tsx` — restructure sections, hero CTA flip, copy cleanup
- `components/AnnouncementBar.tsx` — navy surface
- `components/Nav.tsx` — cream surface, mobile phone chip, focus-trap on hamburger
- `components/Button.tsx` — navy primary fill, ghost secondary
- `components/Card.tsx` — peach variant border, optional `cream-paper` variant
- `components/TrustBadge.tsx` — Albert Sans
- `components/Footer.tsx` — architectural navy (large phone, token cleanup)
- `components/LeadForm.tsx` — pill tabs, larger inputs, cream-tinted bgs
- `components/motion/FadeUp.tsx` — initial visibility bug fix
- `components/motion/Stagger.tsx` — initial visibility bug fix
- `components/motion/StaggerWords.tsx` — initial visibility bug fix

**Modified tests:**
- `tests/FadeUp.test.tsx` — add opacity:1 assertion
- `tests/Stagger.test.tsx` — add opacity:1 assertion
- `tests/StaggerWords.test.tsx` — add opacity:1 assertion
- `tests/Nav.test.tsx` — assert mobile phone chip visible without opening menu
- `tests/LeadForm.test.tsx` — update tab query (pill ↔ underline)
- `tests/Button.test.tsx` — update primary class assertion if needed
- `tests/TrustBadge.test.tsx` — no change expected

**New tests:**
- `tests/TrustSentence.test.tsx`
- `tests/ServicesList.test.tsx`

**Unchanged:**
- `components/Logo.tsx` (visual treatment carried by font swap)
- `components/HeroIllustration.tsx`
- `components/motion/HoverLift.tsx`
- `lib/motion.ts`, `lib/lead-schema.ts`, `lib/send-lead-email.ts`, `lib/use-reduced-motion-safe.ts`
- `app/api/lead/route.ts`
- All `tests/*-schema*`, `tests/api-lead`, `tests/send-lead-email`, `tests/smoke`, `tests/reduced-motion`, `tests/use-reduced-motion-safe`

---

## Task ordering rationale

1. **Tasks 1–2 (foundation):** Fonts and tokens. Everything visual depends on these landing first.
2. **Task 3 (motion fix):** Independent of design; ships the critical bug fix.
3. **Tasks 4–5 (content hygiene):** Em dashes and config TBD handling. Independent.
4. **Tasks 6–11 (component updates):** Each component refactor lands and commits independently.
5. **Tasks 12–13 (new components):** `TrustSentence`, `ServicesList`. Built with tests first.
6. **Task 14 (page integration):** Glue everything together in `app/page.tsx`. Includes hero CTA flip + section spacing rhythm + scroll-margin.
7. **Task 15 (verification):** Build, typecheck, lint, tests, Lighthouse, contrast, impeccable re-run.

---

## Task 1: Swap fonts (Spectral + Albert Sans)

**Files:**
- Modify: `lib/fonts.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace font imports in `lib/fonts.ts`**

```ts
import { Spectral, Albert_Sans } from "next/font/google";

export const spectral = Spectral({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

export const albert = Albert_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-albert",
});
```

- [ ] **Step 2: Update `app/layout.tsx` to use the new variables**

Find the import line `import { inter, playfair } from "@/lib/fonts";` and replace:

```tsx
import { albert, spectral } from "@/lib/fonts";
```

Then update the `<html>` className:

```tsx
<html lang="en" className={`${albert.variable} ${spectral.variable}`}>
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run typecheck && npm run build`
Expected: clean compile (will fail later when globals.css still references old variables; that's resolved in Task 2)

- [ ] **Step 4: Commit**

```bash
git add lib/fonts.ts app/layout.tsx
git commit -m "feat(fonts): swap Playfair + Inter for Spectral + Albert Sans"
```

---

## Task 2: Update design tokens in `app/globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace the entire `app/globals.css` contents**

Open `app/globals.css` and replace its contents with:

```css
@import "tailwindcss";

@theme {
  /* Palette — Committed warm peach-cream brand */
  --color-navy: #0f2b47;
  --color-care-blue: #5a8bb8;
  --color-cream: #fdeedd;
  --color-cream-deep: #f0dcb8;
  --color-cream-edge: #ead8b6;
  --color-slate: #5a6b7e;
  --color-success-green: #2d6a4f;
  --color-alert-red: #9a2f24;
  --color-footer-muted: rgba(253, 238, 221, 0.65);

  /* Typography */
  --font-display: var(--font-spectral), Georgia, serif;
  --font-sans: var(--font-albert), system-ui, -apple-system, sans-serif;

  /* Spacing rhythm — varied per section, see app/page.tsx */
  --spacing-section-y-desktop: 6rem;
  --spacing-section-y-mobile: 3.5rem;

  /* Radius */
  --radius-card: 0.5rem;
  --radius-pill: 9999px;
}

/* Base element styling */
html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  background: var(--color-cream);
  color: var(--color-navy);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-navy);
  font-weight: 500;
  line-height: 1.05;
}

h1 { font-size: clamp(2.5rem, 6vw, 4rem); }
h2 { font-size: clamp(2rem, 4.5vw, 3rem); }
h3 { font-size: 1.5rem; }

/* Anchored sections clear the sticky nav on hash navigation */
section[id] {
  scroll-margin-top: 5rem;
}

/* Focus ring — accessible and on-brand */
:focus-visible {
  outline: 2px solid var(--color-navy);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Verify dev server renders without errors**

Run: `npm run dev` in one terminal, hit `http://localhost:3000` — page should load. Some sections will look broken (still referencing old `bg-mist`, `border-borderline`) — that's expected; tasks 6–11 fix each component.

Stop the dev server (Ctrl-C).

- [ ] **Step 3: Verify typecheck + lint still pass**

Run: `npm run typecheck && npm run lint`
Expected: pass (no TypeScript or ESLint impact from CSS changes)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): replace palette with peach-cream brand + Spectral type defaults"
```

---

## Task 3: Fix motion visibility bug (FadeUp + Stagger + StaggerWords)

**Files:**
- Modify: `components/motion/FadeUp.tsx`
- Modify: `components/motion/Stagger.tsx`
- Modify: `components/motion/StaggerWords.tsx`
- Modify: `tests/FadeUp.test.tsx`
- Modify: `tests/Stagger.test.tsx`
- Modify: `tests/StaggerWords.test.tsx`

The bug: `initial={{ opacity: 0 }}` plus an intersection observer means content stays invisible for any viewer that doesn't scroll (search crawlers, link-preview generators, print, screenshot APIs, reduced-motion users on first paint). Fix: keep the entrance motion but never let opacity gate visibility. Animate y only.

- [ ] **Step 1: Write a failing test for FadeUp visibility**

Open `tests/FadeUp.test.tsx`. Replace the entire contents with:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FadeUp } from "@/components/motion/FadeUp";

describe("FadeUp", () => {
  it("renders its children", () => {
    render(
      <FadeUp>
        <h1>Hello</h1>
      </FadeUp>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts an optional delay prop without throwing", () => {
    render(
      <FadeUp delay={200}>
        <p>Delayed</p>
      </FadeUp>
    );
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });

  it("renders content at opacity 1 even when not yet in view", () => {
    // jsdom + the IntersectionObserver mock means useInView returns false.
    // The component must still render visible content — visibility cannot
    // gate on scroll for crawlers, link previews, print, etc.
    const { container } = render(
      <FadeUp>
        <p>VisibleAlways</p>
      </FadeUp>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const opacity = wrapper.style.opacity;
    // Acceptable: opacity is empty (default 1) or explicitly "1".
    // Unacceptable: "0".
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails on the new assertion**

Run: `npx vitest run tests/FadeUp.test.tsx`
Expected: third test fails because current FadeUp sets `initial={{ opacity: 0 }}` and motion/react applies opacity:0 to the rendered element when not in view.

- [ ] **Step 3: Replace `components/motion/FadeUp.tsx`**

Replace the entire contents with:

```tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type FadeUpProps = {
  children: ReactNode;
  delay?: number; // milliseconds
  className?: string;
};

/**
 * Enhances a fade-up entrance from a baseline that is ALWAYS visible.
 * Opacity is locked at 1; only `y` translates from 16 → 0 when the element
 * enters view. This guarantees content is visible to non-scrolling viewers
 * (crawlers, link previews, print, screenshot APIs).
 */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 16 }}
      animate={inView ? { y: 0 } : { y: 16 }}
      transition={{ ...easeOut, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run FadeUp tests to verify they pass**

Run: `npx vitest run tests/FadeUp.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Write the analogous test for Stagger**

Open `tests/Stagger.test.tsx` and add this test inside the existing `describe("Stagger", ...)` block (or replace if the test patterns conflict):

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

describe("Stagger", () => {
  it("renders its children", () => {
    render(
      <Stagger>
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
      </Stagger>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("renders items at opacity 1 even when not yet in view", () => {
    const { container } = render(
      <Stagger>
        <StaggerItem>Always</StaggerItem>
      </Stagger>
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const opacity = wrapper.style.opacity;
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
```

- [ ] **Step 6: Run Stagger tests — expect the visibility test to fail**

Run: `npx vitest run tests/Stagger.test.tsx`
Expected: visibility test fails (current Stagger uses variants with `hidden: { opacity: 0 }`).

- [ ] **Step 7: Replace `components/motion/Stagger.tsx`**

Replace the entire contents with:

```tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, Variants } from "motion/react";
import { softSpring, staggerChildren } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

// Variants animate only `y`. Opacity is never gated on inView so content
// stays visible to non-scrolling viewers.
const parentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren },
  },
};

const itemVariants: Variants = {
  hidden: { y: 8 },
  visible: { y: 0, transition: softSpring },
};

export function Stagger({ children, className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={parentVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 8: Run Stagger tests — verify pass**

Run: `npx vitest run tests/Stagger.test.tsx`
Expected: tests pass.

- [ ] **Step 9: Update `tests/StaggerWords.test.tsx` with a visibility assertion**

Add a new test inside the existing describe block:

```tsx
it("renders words at opacity 1 even when not yet in view", () => {
  const { container } = render(
    <StaggerWords as="h2" text="Hello world" />
  );
  const heading = container.querySelector("h2");
  expect(heading).toBeInTheDocument();
  // Each word should be a span. None should have opacity:0 inline.
  const wordSpans = heading?.querySelectorAll("span") ?? [];
  expect(wordSpans.length).toBeGreaterThan(0);
  wordSpans.forEach((span) => {
    const opacity = (span as HTMLElement).style.opacity;
    expect(opacity === "" || opacity === "1").toBe(true);
  });
});
```

- [ ] **Step 10: Run StaggerWords tests — expect new test to fail**

Run: `npx vitest run tests/StaggerWords.test.tsx`
Expected: visibility test fails (current StaggerWords sets `animate={... { opacity: 0, y: 8 }}` when not in view and not reduced).

- [ ] **Step 11: Replace `components/motion/StaggerWords.tsx`**

Replace the entire contents with:

```tsx
"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "motion/react";
import { softSpring, staggerWords as staggerWordsToken } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type StaggerWordsProps = {
  /** Text to render. String = one line. String[] = lines separated by <br/>. */
  text: string | string[];
  /** Semantic element tag. Default "h1". */
  as?: "h1" | "h2" | "h3";
  /** Per-word stagger interval in ms. Default 100. */
  stagger?: number;
  /** Initial delay before the first word in ms. Default 0. */
  delay?: number;
  /** "load" = animate on mount. "in-view" = animate when 20% scrolled in. */
  trigger?: "load" | "in-view";
  className?: string;
};

/**
 * Word-by-word entrance. Words are ALWAYS opacity:1 in the rendered output;
 * only `y` translates. Guarantees crawlers, link previews, print, and
 * reduced-motion-before-hydration all see the content.
 */
export function StaggerWords({
  text,
  as = "h1",
  stagger = staggerWordsToken * 1000,
  delay = 0,
  trigger = "in-view",
  className,
}: StaggerWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  const lines = Array.isArray(text) ? text : [text];
  const shouldAnimate = !reduced && (trigger === "load" || inView);

  let wordIndex = 0;
  const children = lines.flatMap((line, lineIdx) => {
    const words = line.split(/\s+/).filter(Boolean);
    const lineNodes = words.map((word, i) => {
      const isLast = i === words.length - 1;
      const idx = wordIndex++;
      return (
        <Fragment key={`l${lineIdx}w${i}`}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={shouldAnimate ? { y: 8 } : false}
            animate={shouldAnimate ? { y: 0 } : { y: 0 }}
            transition={{
              ...softSpring,
              delay: (delay + idx * stagger) / 1000,
            }}
          >
            {word}
          </motion.span>
          {!isLast && " "}
        </Fragment>
      );
    });
    return lineIdx < lines.length - 1
      ? [...lineNodes, <br key={`br${lineIdx}`} />]
      : lineNodes;
  });

  if (as === "h2") {
    return <h2 ref={ref} className={className}>{children}</h2>;
  }
  if (as === "h3") {
    return <h3 ref={ref} className={className}>{children}</h3>;
  }
  return <h1 ref={ref} className={className}>{children}</h1>;
}
```

- [ ] **Step 12: Run all motion tests — verify pass**

Run: `npx vitest run tests/FadeUp.test.tsx tests/Stagger.test.tsx tests/StaggerWords.test.tsx`
Expected: all pass.

- [ ] **Step 13: Commit**

```bash
git add components/motion/ tests/FadeUp.test.tsx tests/Stagger.test.tsx tests/StaggerWords.test.tsx
git commit -m "fix(motion): always-visible baseline so non-scrolling viewers see content"
```

---

## Task 4: Remove em dashes site-wide

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/site-config.ts`
- Modify: `components/AnnouncementBar.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/HeroIllustration.tsx`

The impeccable shared design law: no em dashes. Replace with commas, colons, periods, or parentheses. The site currently uses em dashes in hero subhead, about copy, service descriptions, featured RPM line, footer copyright line, and HeroIllustration alt text.

- [ ] **Step 1: Find every em dash in source**

Run: `grep -rn '—' app/ components/ lib/ --include='*.ts' --include='*.tsx'`
Expected: a list of file:line matches. Capture this list before editing.

- [ ] **Step 2: Update `lib/site-config.ts` service descriptions**

Replace the `services` array with:

```ts
export const services = [
  {
    name: "Skilled Nursing",
    description: "Wound care, medication management, chronic disease support.",
    iconName: "Stethoscope",
  },
  {
    name: "Physical Therapy",
    description: "Mobility, strength, and balance after surgery or progressive conditions.",
    iconName: "PersonSimpleWalk",
  },
  {
    name: "Occupational Therapy",
    description: "Cognitive and physical recovery for post-stroke, post-injury, and daily-routine support.",
    iconName: "HandHeart",
  },
  {
    name: "Speech Therapy",
    description: "Communication and swallowing recovery, post-stroke and neurological.",
    iconName: "ChatCircleDots",
  },
  {
    name: "Medical Social Work",
    description: "Benefits navigation, community resources, and family support.",
    iconName: "UsersThree",
  },
  {
    name: "Home Health Aide",
    description: "Personal care, bathing, grooming, meal prep, and companionship.",
    iconName: "House",
  },
  {
    name: "Remote Patient Monitoring",
    description: "Daily vital signs via connected home devices, for early intervention and peace of mind.",
    iconName: "Heartbeat",
  },
] as const;
```

- [ ] **Step 3: Update `app/page.tsx` hero subhead and about paragraph**

In the Hero subhead, replace:

```tsx
Medicare-certified skilled nursing, therapy, and personal care —
delivered across Katy, Fort Bend, and Harris counties since{" "}
{siteConfig.foundedYear}.
```

with:

```tsx
Medicare-certified skilled nursing, therapy, and personal care,
delivered across Katy, Fort Bend, and Harris counties since{" "}
{siteConfig.foundedYear}.
```

In the about paragraph, replace:

```tsx
Lifecare Options has served Katy families since 2008. We&apos;re
a CHAP-accredited, Medicare-certified home health agency, locally
owned and small enough to know your name. Our clinicians bring
skilled care into the home — where healing is most natural — and
we&apos;re on-call 24/7 for whatever comes next.
```

with:

```tsx
Lifecare Options has served Katy families since 2008. We&apos;re
a CHAP-accredited, Medicare-certified home health agency, locally
owned and small enough to know your name. Our clinicians bring
skilled care into the home, where healing is most natural, and
we&apos;re on-call 24/7 for whatever comes next.
```

In the services subhead, replace:

```tsx
Physician-ordered home health covered by Medicare. Our team works
together around your care plan — no handoff gaps.
```

with:

```tsx
Physician-ordered home health covered by Medicare. Our team works
together around your care plan, with no handoff gaps.
```

- [ ] **Step 4: Update `components/HeroIllustration.tsx` alt text**

Replace the `alt` prop value with (em dashes removed):

```tsx
alt="A pencil-sketch illustration of a caregiver seated beside an elderly woman on a couch, the caregiver's hand resting gently on her shoulder. Behind them, a sunlit window, a lamp, and potted plants."
```

- [ ] **Step 5: Update `components/Footer.tsx` copyright line**

Replace:

```tsx
© {new Date().getFullYear()} {siteConfig.name} Home Health Services ·
Equal opportunity employer
```

with (the `·` separator is already correct — just confirm no em dashes elsewhere in this file):

```tsx
© {new Date().getFullYear()} {siteConfig.name} Home Health Services ·
Equal opportunity employer
```

(No change needed if grep showed no em dashes here; otherwise replace any.)

- [ ] **Step 6: Verify zero em dashes remain in app/ components/ lib/**

Run: `grep -rn '—' app/ components/ lib/ --include='*.ts' --include='*.tsx'`
Expected: empty result.

- [ ] **Step 7: Run all tests**

Run: `npm test`
Expected: pass. The `services` description text is asserted in some tests; this step verifies the rewording didn't break anything.

If `tests/ServicesList.test.tsx` (created later in Task 13) is referenced — it doesn't exist yet, so won't run.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx lib/site-config.ts components/HeroIllustration.tsx components/Footer.tsx
git commit -m "chore(copy): remove em dashes site-wide per impeccable shared design law"
```

---

## Task 5: Handle TBD values in site-config gracefully

**Files:**
- Modify: `lib/site-config.ts`

The current `medicareCcn` and `stateLicense` fields literally hold the string `"[TBD — fill before launch]"`. If a future component renders them, the placeholder leaks to production.

- [ ] **Step 1: Update the config type to allow null**

Modify `lib/site-config.ts` so the TBD fields become nullable. Replace the relevant lines:

```ts
  medicareCcn: null as string | null, // Fill with real CCN before launch
  stateLicense: null as string | null, // Fill with real Texas state license number before launch
```

- [ ] **Step 2: Verify no current component renders these fields unconditionally**

Run: `grep -rn 'medicareCcn\|stateLicense' app/ components/`
Expected: zero results (neither field is currently rendered).

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add lib/site-config.ts
git commit -m "chore(config): replace [TBD] placeholders with nullable types for CCN + license"
```

---

## Task 6: AnnouncementBar — navy surface

**Files:**
- Modify: `components/AnnouncementBar.tsx`

- [ ] **Step 1: Replace `components/AnnouncementBar.tsx` contents**

```tsx
"use client";

import { motion } from "motion/react";
import { Heartbeat } from "@phosphor-icons/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Thin announcement band above the Nav. Navy surface gives architectural
 * contrast against the peach-cream brand below (and bookends with the
 * navy footer). Single short message — keep the copy tight. Not sticky.
 */
export function AnnouncementBar() {
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      className="bg-navy text-cream"
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...easeOut, duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm md:px-6">
        <Heartbeat
          size={18}
          weight="duotone"
          className="text-cream shrink-0"
          aria-hidden
        />
        <span className="font-medium">
          Now offering Remote Patient Monitoring.
        </span>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Run dev server to visually verify the navy bar appears at top**

Run: `npm run dev`
Hit `http://localhost:3000`. Top of page should show a navy strip with cream Heartbeat icon and "Now offering Remote Patient Monitoring." in cream.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/AnnouncementBar.tsx
git commit -m "feat(announcement): navy surface for architectural top/bottom contrast"
```

---

## Task 7: Nav — cream surface, mobile phone chip, a11y

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `tests/Nav.test.tsx`

The mobile nav today hides the phone behind the hamburger. After this task, the phone is always visible at every breakpoint, and the hamburger gets Esc-close, focus-trap (via `inert`), and body-scroll-lock for accessibility.

- [ ] **Step 1: Add a failing test for the mobile phone chip**

Append to `tests/Nav.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Nav } from "@/components/Nav";

describe("Nav mobile phone chip", () => {
  it("renders a visible phone tel: link without opening the hamburger", () => {
    render(<Nav />);
    // The mobile-visible chip lives outside the .md:flex desktop block
    // and outside the toggled menu. It must be in the DOM on initial render.
    const chip = screen.getByTestId("mobile-phone-chip");
    expect(chip).toHaveAttribute("href", "tel:+12816469546");
    // It must contain the phone number text for screen readers
    expect(chip).toHaveTextContent(/281.*9546/i);
  });
});
```

- [ ] **Step 2: Run Nav tests — expect new test to fail**

Run: `npx vitest run tests/Nav.test.tsx`
Expected: phone-chip test fails (component lacks the data-testid).

- [ ] **Step 3: Replace `components/Nav.tsx` contents**

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 8;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD
  );

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Escape-to-close + body-scroll-lock while mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const scrolledStyling = isScrolled || open;

  const headerClasses = [
    "sticky top-0 z-50 border-b border-cream-edge transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling
      ? "bg-cream/98 backdrop-blur shadow-sm"
      : "bg-cream/95 backdrop-blur",
  ].join(" ");

  const containerClasses = [
    "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-6 transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling ? "py-3" : "py-4",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        <Logo size="md" />

        {/* Always-visible phone chip — both desktop and mobile see it */}
        <Link
          data-testid="mobile-phone-chip"
          href={siteConfig.phoneHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-2 text-xs font-semibold text-cream hover:bg-navy/90 md:hidden"
          aria-label={`Call ${siteConfig.phone}`}
        >
          <Phone size={14} />
          <span className="whitespace-nowrap">{siteConfig.phone}</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-care-blue"
          >
            <Phone size={14} />
            {siteConfig.phone}
          </Link>
          <Button href="#contact">Request info →</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="p-2 text-navy md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-cream-edge bg-cream md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <Button href="#contact" size="lg">
              Request info →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run Nav tests — verify pass**

Run: `npx vitest run tests/Nav.test.tsx`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx tests/Nav.test.tsx
git commit -m "feat(nav): cream surface, always-visible mobile phone chip, Esc-close + scroll-lock"
```

---

## Task 8: Button — navy primary, ghost secondary

**Files:**
- Modify: `components/Button.tsx`
- Modify (if needed): `tests/Button.test.tsx`

- [ ] **Step 1: Read current button tests to spot any class assertions that will break**

Run: `cat tests/Button.test.tsx`
Note: if the test asserts on `bg-care-blue`, that's about to change.

- [ ] **Step 2: Replace the `VARIANT_STYLES` block in `components/Button.tsx`**

Open `components/Button.tsx`. Replace:

```tsx
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-care-blue text-white hover:bg-[#4a7aa3] rounded-full",
  secondary:
    "bg-white text-navy border-[1.5px] border-navy hover:bg-mist rounded-full",
  tertiary:
    "bg-transparent text-care-blue hover:text-navy underline-offset-4 hover:underline",
};
```

with:

```tsx
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-navy text-cream hover:bg-navy/90 rounded-full",
  secondary:
    "bg-transparent text-navy border-[1.5px] border-navy hover:bg-navy/5 rounded-full",
  tertiary:
    "bg-transparent text-navy hover:text-care-blue underline-offset-4 hover:underline",
};
```

- [ ] **Step 3: Update any Button tests that assert on the old class names**

If `tests/Button.test.tsx` asserts on `bg-care-blue`, replace with `bg-navy`. If it asserts on `text-white`, replace with `text-cream`. Use Edit.

- [ ] **Step 4: Run Button tests**

Run: `npx vitest run tests/Button.test.tsx`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/Button.tsx tests/Button.test.tsx
git commit -m "feat(button): navy primary fill, ghost secondary on cream surface"
```

---

## Task 9: TrustBadge + Card refinements

**Files:**
- Modify: `components/TrustBadge.tsx`
- Modify: `components/Card.tsx`

- [ ] **Step 1: Update `components/TrustBadge.tsx`**

The current TrustBadge uses generic Inter via the body inheritance. After Task 2 it inherits Albert Sans, so no class changes needed. Verify by reading current file — no source change required. Confirm pill colors remain on-brand (success-green stays).

If you want to nudge the pill a little warmer for the cream surface, update only the base background:

```tsx
const base =
  "inline-flex items-center gap-1.5 rounded-full bg-[#e1efe5] px-3 py-1.5 text-xs font-medium text-success-green";
```

(Slightly deeper green than the prior `#e8f3ec` so it carries enough contrast on the cream surface.)

- [ ] **Step 2: Add a border to the `peach` variant in `components/Card.tsx`**

Open `components/Card.tsx` and replace the VARIANT map:

```tsx
const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  peach: "bg-cream-deep border border-cream-edge",
  mist: "bg-white border border-cream-edge",
  white: "bg-white border border-cream-edge",
};
```

(Note: `bg-mist` no longer exists. The `mist` variant now shows white on cream — kept as an alias for backwards compat with any callers; the new design doesn't use it. `peach` becomes `cream-deep` so it reads as the deeper warm card surface against the page's cream surface.)

- [ ] **Step 3: Run Card-affected tests**

Run: `npx vitest run tests/TrustBadge.test.tsx`
Expected: pass.

(There is no `Card.test.tsx`; Card is exercised through other component tests.)

- [ ] **Step 4: Commit**

```bash
git add components/TrustBadge.tsx components/Card.tsx
git commit -m "refactor(card,trust-badge): consistent borders, cream-friendly badge tint"
```

---

## Task 10: LeadForm — pill tabs, larger inputs, cream-tinted

**Files:**
- Modify: `components/LeadForm.tsx`
- Modify: `tests/LeadForm.test.tsx`

- [ ] **Step 1: Identify any tab-style assertions in `tests/LeadForm.test.tsx`**

Run: `cat tests/LeadForm.test.tsx`
Note: if tests query for `border-b-2`, those queries need updating.

- [ ] **Step 2: Update tab styling constants in `components/LeadForm.tsx`**

Open `components/LeadForm.tsx`. Replace the input/label classes near the top:

```tsx
const inputClass =
  "w-full rounded-lg border border-cream-edge bg-cream/60 px-4 py-3 text-base text-navy placeholder:text-slate/60 focus:outline-none focus:border-navy focus:bg-cream";
const labelClass = "block text-sm font-semibold text-navy mb-1.5";
const errorClass = "mt-1 text-xs text-alert-red";
```

Then replace the `<div role="tablist" ...>` block with a rounded-pill segmented control:

```tsx
<div
  role="tablist"
  aria-label="Form type"
  className="inline-flex rounded-full bg-cream-deep p-1 mb-6"
>
  <button
    role="tab"
    aria-selected={tab === "services"}
    onClick={() => setTab("services")}
    className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
      tab === "services"
        ? "bg-navy text-cream"
        : "bg-transparent text-navy/70 hover:text-navy"
    }`}
  >
    Services inquiry
  </button>
  <button
    role="tab"
    aria-selected={tab === "employment"}
    onClick={() => setTab("employment")}
    className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
      tab === "employment"
        ? "bg-navy text-cream"
        : "bg-transparent text-navy/70 hover:text-navy"
    }`}
  >
    Work with us
  </button>
</div>
```

Also update the outer wrapper container width from `max-w-2xl` to `max-w-3xl`:

```tsx
return (
  <div className="mx-auto max-w-3xl">
    {/* … */}
  </div>
);
```

And wrap the inner form in a paper card. Replace the structure around the tablist + inner form so that everything sits inside a `bg-white rounded-lg p-6 md:p-8` wrapper:

```tsx
return (
  <div className="mx-auto max-w-3xl">
    <div className="rounded-lg bg-white p-6 shadow-[0_1px_0_rgba(15,43,71,0.08),_0_4px_16px_rgba(15,43,71,0.06)] md:p-8">
      <div role="tablist" /* …as above… */>
        {/* …tab buttons… */}
      </div>
      <div>
        {tab === "services" ? (
          <ServicesFormFields … />
        ) : (
          <EmploymentFormFields … />
        )}
        {submitState === "error" && (
          <p className="text-alert-red mt-3 text-sm">
            Something went wrong. Please try again or call (281) 646-9546.
          </p>
        )}
      </div>
    </div>
  </div>
);
```

Update the thank-you state container similarly (`max-w-xl` becomes `max-w-3xl`; surface becomes the same paper-card treatment):

```tsx
if (submitState === "ok") {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg bg-white p-8 text-center shadow-[0_1px_0_rgba(15,43,71,0.08),_0_4px_16px_rgba(15,43,71,0.06)] md:p-12">
        <h3 className="text-2xl">Thanks. We got it.</h3>
        <p className="text-slate mt-3 text-sm">
          {tab === "services"
            ? "Our intake team will reach out within 1 business day."
            : "Please email your resume to jobs@mylifecareoptions.com. We'll be in touch within 2 business days."}
        </p>
      </div>
    </div>
  );
}
```

(Note the em-dash-free copy in the thank-you message.)

- [ ] **Step 3: Update `tests/LeadForm.test.tsx` for the new tab markup**

If a test query uses `border-b-2`, replace it with a role-based query:

```tsx
const tab = screen.getByRole("tab", { name: /services inquiry/i });
expect(tab).toHaveAttribute("aria-selected", "true");
```

Keep functional tests (submit, validation) unchanged.

- [ ] **Step 4: Run LeadForm tests**

Run: `npx vitest run tests/LeadForm.test.tsx`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/LeadForm.tsx tests/LeadForm.test.tsx
git commit -m "feat(lead-form): paper-card surface, pill tabs, larger cream-tinted inputs"
```

---

## Task 11: Footer — architectural navy, large phone

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Replace `components/Footer.tsx` contents**

```tsx
import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy text-[var(--color-footer-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Contact — phone gets visual weight */}
          <div>
            <Logo size="md" inverse />
            <div className="mt-5 text-cream">
              <Link
                href={siteConfig.phoneHref}
                className="font-display text-3xl font-medium leading-none hover:text-cream-deep md:text-4xl"
              >
                {siteConfig.phone}
              </Link>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-footer-muted)]">
                Always answered
              </div>
            </div>
            <div className="mt-5 space-y-1 text-sm leading-relaxed">
              <div>{siteConfig.address.street}</div>
              <div>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
              </div>
              <div>Fax: {siteConfig.fax}</div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-cream uppercase">
              Hours
            </div>
            <ul className="space-y-1 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.days}>
                  <span className="text-cream">{h.days}:</span>{" "}
                  <span className="italic">{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-cream-deep">
              {siteConfig.onCall}
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <div className="mb-3 text-xs font-semibold tracking-wider text-cream uppercase">
              Accreditation
            </div>
            <div className="space-y-1 text-sm">
              <div>Medicare-certified</div>
              <div>{siteConfig.accreditation}</div>
              {siteConfig.medicareCcn && (
                <div className="text-[var(--color-footer-muted)]">
                  CCN: {siteConfig.medicareCcn}
                </div>
              )}
              {siteConfig.stateLicense && (
                <div className="text-[var(--color-footer-muted)]">
                  TX License: {siteConfig.stateLicense}
                </div>
              )}
              <div>Serving Katy since {siteConfig.foundedYear}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-6 text-center text-xs uppercase tracking-[0.08em]">
          © {new Date().getFullYear()} {siteConfig.name} Home Health Services
          · Equal opportunity employer
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): architectural navy with large Spectral phone + conditional CCN/license"
```

---

## Task 12: New component — TrustSentence

**Files:**
- Create: `components/TrustSentence.tsx`
- Create: `tests/TrustSentence.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/TrustSentence.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TrustSentence } from "@/components/TrustSentence";

describe("TrustSentence", () => {
  it("renders the credentials eyebrow", () => {
    render(<TrustSentence />);
    expect(screen.getByText(/credentials/i)).toBeInTheDocument();
  });

  it("renders all four credibility claims as text content", () => {
    render(<TrustSentence />);
    expect(screen.getByText(/medicare-certified/i)).toBeInTheDocument();
    expect(screen.getByText(/CHAP-accredited/i)).toBeInTheDocument();
    expect(screen.getByText(/katy/i)).toBeInTheDocument();
    expect(screen.getByText(/2008/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/TrustSentence.test.tsx`
Expected: fails with "Cannot find module '@/components/TrustSentence'".

- [ ] **Step 3: Create `components/TrustSentence.tsx`**

```tsx
/**
 * Editorial pull-quote credentials line. Replaces the previous icon-stacked
 * trust-strip template. One sentence carries every credibility claim; the
 * reader's eye stops, registers, moves on.
 */
export function TrustSentence() {
  return (
    <section className="px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl border-y border-navy/[0.18] py-8 md:py-10">
        <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-navy/60">
          Credentials
        </div>
        <p className="mt-3 max-w-4xl font-display text-2xl leading-tight text-navy md:text-3xl">
          <em className="not-italic font-semibold">Medicare-certified.</em>{" "}
          <em>CHAP-accredited.</em>{" "}
          Serving <em className="not-italic font-semibold">Katy</em> families
          since <em className="not-italic font-semibold">2008</em>.
        </p>
      </div>
    </section>
  );
}
```

(The emphasis pattern mixes Spectral italic and bold for editorial rhythm. The bold uses `not-italic` to override the `<em>` default.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/TrustSentence.test.tsx`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/TrustSentence.tsx tests/TrustSentence.test.tsx
git commit -m "feat(trust-sentence): editorial pull-quote credentials replaces trust-strip"
```

---

## Task 13: New component — ServicesList

**Files:**
- Create: `components/ServicesList.tsx`
- Create: `tests/ServicesList.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/ServicesList.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesList } from "@/components/ServicesList";

describe("ServicesList", () => {
  it("renders the 'Now offering' RPM ribbon at the top", () => {
    render(<ServicesList />);
    expect(screen.getByText(/now offering/i)).toBeInTheDocument();
    expect(screen.getByText(/remote patient monitoring/i)).toBeInTheDocument();
  });

  it("renders the six standard disciplines with their descriptions", () => {
    render(<ServicesList />);
    const standardNames = [
      "Skilled Nursing",
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
      "Medical Social Work",
      "Home Health Aide",
    ];
    standardNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders numerals 01 through 06 for the standard disciplines", () => {
    render(<ServicesList />);
    for (let i = 1; i <= 6; i++) {
      const numeral = String(i).padStart(2, "0");
      expect(screen.getByText(numeral)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ServicesList.test.tsx`
Expected: fails with "Cannot find module".

- [ ] **Step 3: Create `components/ServicesList.tsx`**

```tsx
import { services } from "@/lib/site-config";

/**
 * Numbered editorial list of disciplines. RPM sits on top as a small
 * "Now offering" ribbon; the six standard disciplines render as a
 * two-column numbered list with hairline rules between rows. Replaces
 * the previous icon-card grid.
 */
export function ServicesList() {
  const featured = services.find((s) => s.name === "Remote Patient Monitoring");
  const standard = services.filter(
    (s) => s.name !== "Remote Patient Monitoring",
  );

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-navy/60">
            Our services
          </div>
          <h2 className="mt-2">
            <em>Seven</em> disciplines, one coordinated plan.
          </h2>
          <p className="mt-3 text-slate">
            Physician-ordered home health covered by Medicare. Our team works
            together around your care plan, with no handoff gaps.
          </p>
        </div>

        {featured && (
          <div className="mb-10 rounded-lg border border-cream-edge bg-white p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-alert-red">
                Now offering
              </div>
              <div className="flex-1">
                <div className="font-display text-2xl italic md:text-3xl">
                  {featured.name}
                </div>
                <div className="mt-2 text-base text-slate md:text-lg">
                  {featured.description}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
          {standard.map((service, idx) => {
            const numeral = String(idx + 1).padStart(2, "0");
            return (
              <div
                key={service.name}
                className="flex items-baseline gap-5 border-b border-navy/[0.12] py-5"
              >
                <span className="font-display text-3xl font-medium text-care-blue tabular-nums">
                  {numeral}
                </span>
                <div>
                  <div className="font-display text-xl font-medium">
                    {service.name}
                  </div>
                  <div className="mt-1 text-sm text-slate">
                    {service.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ServicesList.test.tsx`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/ServicesList.tsx tests/ServicesList.test.tsx
git commit -m "feat(services-list): numbered editorial list replaces icon-card grid"
```

---

## Task 14: Integrate everything in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

This is the glue. Replace the page-level composition: drop the old TrustStrip and Services-grid sections; insert `<TrustSentence />` and `<ServicesList />`; flip the hero CTA order; remove Phosphor imports that are no longer needed (the service grid icons); apply per-section spacing rhythm; strip the H1 italic emphasis on "felt".

- [ ] **Step 1: Replace `app/page.tsx` contents**

```tsx
"use client";

import { motion } from "motion/react";
import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { TrustBadge } from "@/components/TrustBadge";
import { TrustSentence } from "@/components/TrustSentence";
import { ServicesList } from "@/components/ServicesList";
import { LeadForm } from "@/components/LeadForm";
import { HeroIllustration } from "@/components/HeroIllustration";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { StaggerWords } from "@/components/motion/StaggerWords";
import { easeOut, softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { siteConfig } from "@/lib/site-config";

function Hero() {
  const reduced = useReducedMotionSafe();
  const ifMotion = <T,>(animated: T, still: T): T => (reduced ? still : animated);

  return (
    <section className="px-4 py-12 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            className="text-[10px] font-semibold tracking-[0.18em] uppercase text-navy/65"
            initial={ifMotion({ opacity: 0 }, { opacity: 1 })}
            animate={{ opacity: 1 }}
            transition={{ ...easeOut, duration: 0.4, delay: 0 }}
          >
            Home Health · Katy, TX
          </motion.div>

          <StaggerWords
            as="h1"
            className="mt-3"
            text={["Quality care,", "felt at home."]}
            trigger="load"
            delay={100}
          />

          <motion.p
            className="text-slate mt-5 max-w-xl text-lg leading-relaxed"
            initial={ifMotion({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, duration: 0.5, delay: 0.25 }}
          >
            Medicare-certified skilled nursing, therapy, and personal care,
            delivered across Katy, Fort Bend, and Harris counties since{" "}
            {siteConfig.foundedYear}.
          </motion.p>

          <div className="mt-7 flex flex-wrap gap-3">
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.4 }}
            >
              <Button href={siteConfig.phoneHref} size="lg">
                <Phone size={16} />
                Call {siteConfig.phone}
              </Button>
            </motion.div>
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.48 }}
            >
              <Button variant="secondary" size="lg" href="#contact">
                Request info ↓
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="aspect-[1024/572] overflow-hidden rounded-lg"
          initial={ifMotion({ opacity: 0 }, { opacity: 1 })}
          animate={{ opacity: 1 }}
          transition={{ ...easeOut, duration: 0.8, delay: 0.2 }}
        >
          <HeroIllustration className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Editorial trust pull-quote (replaces former trust strip) */}
      <TrustSentence />

      {/* 3. About band */}
      <section className="px-4 py-16 md:px-6 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <StaggerWords
              as="h2"
              className=""
              text="Serving Katy families since 2008."
            />
            <FadeUp delay={120}>
              <p className="text-slate mt-5 text-base leading-relaxed">
                Lifecare Options has served Katy families since 2008. We&apos;re
                a CHAP-accredited, Medicare-certified home health agency,
                locally owned and small enough to know your name. Our clinicians
                bring skilled care into the home, where healing is most natural,
                and we&apos;re on-call 24/7 for whatever comes next.
              </p>
            </FadeUp>
          </div>
          <Stagger className="flex flex-wrap gap-2">
            <StaggerItem>
              <TrustBadge>Medicare-certified</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>
                Serving Katy since {siteConfig.foundedYear}
              </TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>24/7 on-call</TrustBadge>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* 4. Services — numbered editorial list */}
      <ServicesList />

      {/* 5. Contact / Lead form */}
      <section id="contact" className="px-4 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <StaggerWords as="h2" className="" text="Get in touch." />
            <p className="text-slate mt-3">
              Or call us directly:{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-navy hover:text-care-blue"
              >
                {siteConfig.phone}
              </a>
              , answered 24/7.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: pass. The Phosphor service icons are no longer imported, so unused-imports lint warnings should not appear.

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: all pass.

- [ ] **Step 4: Visual smoke test in dev**

Run: `npm run dev`
Open `http://localhost:3000`. Walk through:
- Top: navy announcement bar, cream nav with phone chip visible at all viewport widths
- Hero: italic "felt" in headline, "Call (281)…" primary button, "Request info ↓" secondary
- TrustSentence: italic Spectral pull-quote with mixed bold/italic emphasis
- About: 2-column with TrustBadges
- ServicesList: "Now offering" RPM card on top, then 01–06 numbered list (2 cols desktop, 1 col mobile)
- Form: paper card on cream, pill tabs, larger inputs
- Footer: navy with large Spectral phone number

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(page): integrate TrustSentence + ServicesList, phone-first hero CTA, varied spacing"
```

---

## Task 15: Verification & QA

**Files:**
- No source changes; this task verifies acceptance criteria from spec §10.

- [ ] **Step 1: Full build + typecheck + lint + tests**

Run: `npm run build && npm run typecheck && npm run lint && npm test`
Expected: all green.

- [ ] **Step 2: Lighthouse mobile audit on production build**

Run: `npm run build && npm run start &` (background)
Open Chrome DevTools → Lighthouse → mobile, performance + accessibility.
Expected: Performance ≥ 90, Accessibility ≥ 90.
Stop server (`lsof -ti :3000 | xargs kill`).

- [ ] **Step 3: Contrast check via axe-core or manual WebAIM Contrast Checker**

Verify each pair in the spec's §10.6 list:
- `--color-navy` on `--color-cream` (body): expected AA pass at body size
- `--color-slate` (`#5a6b7e`) on `--color-cream`: verify AA at body size; if borderline, deepen slate to `#4a5b6e`
- `--color-cream` on `--color-navy` (footer): expected AA pass
- `--color-care-blue` numerals on `--color-cream`: AA at large size (numerals are display size, large-text threshold applies)
- `--color-alert-red` on `--color-cream`: AA at body size

If any pair fails, deepen the relevant color and re-test.

- [ ] **Step 4: Non-JS render check**

In Chrome DevTools → Settings → Disable JavaScript → reload `http://localhost:3000` (run `npm run dev` first). Confirm all sections still render with content visible (the motion fix from Task 3 should mean every section's content is in the DOM and opacity 1).

- [ ] **Step 5: Re-run impeccable deterministic detector**

Run: `npx -y impeccable --json --fast app components`
Expected: `[]`, exit 0.

- [ ] **Step 6: Re-take Playwright screenshots and visually compare against the spec's intended look**

Run: `cd /tmp/shots-lifecare && node lifecare-shots.mjs`
Open the new screenshots in `/tmp/lifecare-*.png` and confirm:
- Peach-cream surface dominates the page
- Spectral display type with italic emphasis where called for
- Numbered services list with care-blue numerals and hairline rules
- Pill-tab segmented form control
- Large phone number in navy footer
- Cream-on-navy announcement bar at top, navy footer at bottom

- [ ] **Step 7: Final commit (only if any tweaks made during QA)**

```bash
git status
# If any tweaks: git add … && git commit -m "fix(a11y): bump slate contrast to AA threshold"
```

- [ ] **Step 8: Summary report**

Output a short summary listing:
- Tasks completed
- Tests added (count) and passing (count)
- Lighthouse Performance + Accessibility scores
- Any contrast adjustments made
- Confirmed impeccable detector clean
- Open `[ ]` checklist items from spec §11 (TBDs the user still owes: CCN, license, two copy approvals, illustration confirm)

---

## Self-review notes

This plan covers every spec section:

| Spec section | Covered by task |
|---|---|
| §4.1 color tokens | Task 2 |
| §4.2 typography | Tasks 1, 2 |
| §4.3 spacing rhythm | Task 14 (per-section padding) |
| §4.4 motion | Task 3 |
| §4.5 iconography | Task 14 (Phosphor service-row icons removed) |
| §5.1 AnnouncementBar | Task 6 |
| §5.2 Nav | Task 7 |
| §5.3 Hero | Task 14 |
| §5.4 Trust pull-quote | Task 12 |
| §5.5 About | Task 14 (TrustBadge font inheritance + em-dash copy) |
| §5.6 ServicesList | Task 13 |
| §5.7 LeadForm | Task 10 |
| §5.8 Footer | Task 11 |
| §6 motion bug fix | Task 3 |
| §7 surgical fixes (10 items) | Tasks 2 (#fff bg), 4 (em dashes), 5 (TBDs), 7 (mobile menu a11y), 9 (Card peach border), 11 (footer raw hex), 14 (spec drift, spacing), 2 (scroll-margin via section[id] rule) |
| §8 component changes | Tasks 6–13 |
| §9 testing | Tasks 3, 7, 10, 12, 13 |
| §10 acceptance | Task 15 |

No placeholder text remains. All file paths are exact. Type names (`Tab`, `ButtonVariant`, `FormHandlers`, etc.) are consistent with the existing codebase. The plan can be executed task-by-task without ambiguity.
