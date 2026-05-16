# Motion + Polish Layer — Design Spec

**Date:** 2026-05-16
**Status:** Draft — awaiting user review
**Branch:** `phase-0` (will fork to feature branch for implementation)
**Predecessor specs:** [`2026-04-17-phase-0-lead-capture-design.md`](2026-04-17-phase-0-lead-capture-design.md)

---

## 1. Goal

The Phase 0 site shipped functional but feels static. This pass adds a tasteful motion + polish layer on top of the existing structure — no layout rewrites, no architectural changes. The user-facing payoff is that the page feels alive, warm, and trustworthy without reading as flashy.

**Motion personality:** *Warm & personable* — soft springs, gentle scale-ups, slightly playful timing. Not the calm/medical end of the spectrum; not the bold/modern end. This decision drives every timing and easing choice in the spec.

**Audience consideration:** Home health audiences skew older (patients) and middle-aged (adult children researching care for parents). All motion must honor `prefers-reduced-motion` and never block or distract from content.

---

## 2. Scope

### In scope

- Motion system foundation (shared primitives, easing tokens, reduced-motion handling)
- Hero: real Unsplash photo + entrance choreography
- Trust strip: Phosphor duotone icons + scroll-triggered entrance
- About band: scroll-reveal heading/paragraph + staggered badges with hover
- Services grid: Phosphor duotone icons per service + staggered entrance + hover lift
- Nav: scroll-aware shadow/padding transition
- Buttons: tap-feedback micro-interaction
- Reduced-motion policy enforced via single hook
- Smoke test for reduced-motion behavior

### Out of scope

- Lead form polish (explicitly skipped by user)
- Footer changes (explicitly skipped by user)
- Logo redesign or resizing beyond what's already shipped
- Nav structural changes (mobile menu, link additions)
- New page sections or content
- Custom-drawn icons (Phosphor duotone is the chosen system; bespoke iconography deferred)
- Arrow nudge on buttons with "→" — deferred; requires invasive Button API change
- Logo shrink on scroll — rejected (reads gimmicky for healthcare)
- Lighthouse performance optimizations beyond what motion components already require

---

## 3. Stack additions

| Package | Purpose | Notes |
|---|---|---|
| `@phosphor-icons/react` | Service / trust / about icons | New dependency. Use `weight="duotone"`. |
| `framer-motion` | All motion | Already installed (v12.38.0). Import path is `motion/react`. |

No changes to Next.js, React, Tailwind, or any other existing dependency.

---

## 4. Motion System Foundation (§1)

### 4.1 Easing tokens

New module `lib/motion.ts` exports three named presets used throughout the codebase:

```ts
export const softSpring = { type: "spring", stiffness: 120, damping: 18 } as const;
export const easeOut = { duration: 0.5, ease: [0.16, 1, 0.3, 1] } as const;
export const quickTap = { duration: 0.15, ease: "easeOut" } as const;
```

- `softSpring` — default for warm, gentle entrance + hover motion
- `easeOut` — for fades that shouldn't bounce (paragraphs, kicker labels)
- `quickTap` — for button-press feedback

### 4.2 Reduced-motion hook

New module `lib/use-reduced-motion-safe.ts` wraps Framer's `useReducedMotion` so every motion component reads from one source of truth. Returns `boolean` (true when reduced motion preferred).

### 4.3 Motion primitives

New folder `components/motion/` with three exports:

**`<FadeUp delay={0}>`**
- Wraps children, fades them in + slides up 16px when scrolled into view
- Uses `useInView` with `once: true`, `amount: 0.2`
- Uses `easeOut` token
- Respects reduced motion: renders at final state instantly
- Optional `delay` prop in milliseconds

**`<Stagger>` + `<StaggerItem>`**
- Parent/child pattern using Framer's variants
- Parent controls stagger timing (default 80ms between children)
- Each child slides up 8px + fades in via `softSpring`
- Respects reduced motion

**`<HoverLift>`**
- Wraps an element; on hover applies `y: -4` + grows shadow via `softSpring`
- Tap state: `scale: 0.98`
- Reduced motion: hover skipped; tap kept (interaction feedback)

### 4.4 Scroll-trigger convention

All scroll-triggered animations use `useInView({ once: true, amount: 0.2 })`. Fires once when 20% of element is visible. Never re-triggers on scroll up. Acceptable tradeoff for a single-page site: if user reloads and scroll-jumps fast, they may miss some animations. Not a UX problem.

### 4.5 Client component boundaries

All motion primitives require `"use client"` directive. Page sections that consume them (Hero, Trust strip, About, Services) become client components. Acceptable: the page is single-route and already client-heavy via LeadForm.

---

## 5. Hero (§2)

### 5.1 Photo

- Direction: **Caring Hands** — close-up of caregiver + patient hands meeting, warm tungsten light, no faces visible
- Source: Unsplash, queried during implementation against the "Caring Hands" brief. License-free, attribution not required but optional.
- Format: served via `next/image` with `priority` flag
- Sizing: `sizes="(max-width: 768px) 100vw, 50vw"`
- Aspect ratio: 4:3 (matches current placeholder container)
- Alt text: descriptive — e.g., "A caregiver's hands holding a patient's hands in warm light." Not decorative — informs visually-impaired users of the emotional context.
- Replaces the current `<div className="from-borderline to-peach-cream aspect-[4/3] rounded-2xl bg-gradient-to-br" aria-hidden />`

### 5.2 Entrance choreography

Runs on mount (no scroll trigger — above the fold). Timings are cumulative from page load:

| Time | Element | Motion | Easing |
|---|---|---|---|
| 0ms | Kicker label ("Home Health · Katy, TX") | Fade in (400ms) | `easeOut` |
| 100ms | Headline ("Quality care, felt at home.") | Fade + slide up 16px (600ms) | `easeOut` |
| 200ms | Photo | Fade + scale 0.97→1.0 (800ms) | `easeOut` |
| 250ms | Paragraph | Fade + slide up 12px (500ms) | `easeOut` |
| 400ms | Button row | Stagger, each fades + slides up 8px (80ms apart) | `softSpring` |

### 5.3 Hover states

- Photo: slow scale to 1.02 over 1200ms (very subtle "breath")
- Primary button: `whileTap` scale to 0.97 (`quickTap`)
- Secondary button: same tap scale

### 5.4 Reduced motion

- Entire entrance sequence skipped — renders at final state on mount
- Photo hover scale: skipped (decorative)
- Button tap scale: kept (interaction feedback)

---

## 6. Trust Strip, About Band, Services Grid (§3)

### 6.1 Trust strip

**Icons added** (Phosphor duotone, 32px, navy outline + care-blue tinted fill):

| Item | Icon |
|---|---|
| Medicare-certified | `ShieldCheck` |
| Serving Katy since 2008 | `House` |
| 24/7 on-call nursing | `PhoneCall` |

Icons sit above the existing text (centered). Whole strip wraps in `<FadeUp>` — single block, no stagger (compact section).

### 6.2 About band

- Heading: `<FadeUp delay={0}>`
- Paragraph: `<FadeUp delay={120}>`
- Badge row: `<Stagger>` parent — each `<TrustBadge>` is a `<StaggerItem>`, fades + slides up 8px, 80ms apart
- Badge hover: scale to 1.04 + bg tint deepens from `#e8f3ec` (current) to `#d9ebde` (~10% darker shade of same hue), via `softSpring`. Implemented inside `TrustBadge` component (wraps existing span in `motion.span`).

### 6.3 Services grid

**Icons added** (Phosphor duotone, 36px, navy outline + care-blue duotone fill):

| Service | Icon |
|---|---|
| Skilled Nursing | `Stethoscope` |
| Physical Therapy | `PersonSimpleWalk` |
| Occupational Therapy | `HandHeart` |
| Speech Therapy | `ChatCircleDots` |
| Medical Social Work | `UsersThree` |
| Home Health Aide | `House` |

**Data shape change:** `services` array in `lib/site-config.ts` gains a `iconName: string` field per entry. The services section in `app/page.tsx` maintains a small `iconMap: Record<string, IconComponent>` to look up the component by name. Keeps `site-config.ts` as pure data (no JSX imports in a config file).

**Entrance:** Grid wraps in `<Stagger>` (80ms between cards). Triggered when 20% of grid is in view.

**Hover:** Each card wrapped in `<HoverLift>` — translates `y: -4`, grows shadow from `shadow-sm` to `shadow-lg`, `softSpring`. Background color (peach/white/mist alternation) unchanged.

**Card component change:** `Card.tsx` gains optional `icon?: ReactNode` slot rendered above children, or icon passed as a normal child. Simpler: keep `Card` API unchanged, pass the icon as the first JSX child in `app/page.tsx`. Decision: keep `Card` unchanged; layout responsibility in page.tsx.

---

## 7. Nav + Buttons (§4)

### 7.1 Nav scroll-aware behavior

State: single boolean `isScrolled` (true when `scrollY > 8`).

| State | Padding | Shadow | Background |
|---|---|---|---|
| At top (`isScrolled === false`) | `py-4` | none | `bg-white/95` |
| Scrolled (`isScrolled === true`) | `py-3` | `shadow-sm` | `bg-white/98` |

- Transition: `transition-all duration-200 ease-out` on header element
- Scroll listener: `useEffect` with `addEventListener("scroll", ...)` throttled via `requestAnimationFrame` (avoids 60fps spam)
- Cleanup: removes listener on unmount
- Mobile menu open → forces scrolled-state styling regardless of scroll position
- Logo size: unchanged (no shrink)

### 7.2 Button micro-interactions

- `Button.tsx` switches to `motion(Link)` for the link path and `motion.button` for the button path
- `whileTap={{ scale: 0.97 }}` applied to both paths, using `quickTap` transition
- Existing Tailwind `transition-colors` for hover unchanged
- Reduced motion: tap scale **kept** (it's interaction feedback)
- Tertiary variant: no tap scale (it's a text link; tap-bounce would look wrong)

---

## 8. Reduced Motion + Testing (§5)

### 8.1 Reduced-motion policy

| Behavior | When reduced motion enabled |
|---|---|
| Entrance fades / slides | Skipped — render at final state |
| Stagger sequences | Skipped — render at final state |
| Hover lifts (cards) | Skipped — static rest state on hover |
| Photo hover scale | Skipped (decorative) |
| Button hover color change | Kept (Tailwind, instant) |
| Button tap scale | Kept (interaction feedback) |
| Nav scroll-aware shadow/padding | Kept, but transition disabled (instant state flip — no fade/animate between scrolled and at-top styling) |

All routed through `useReducedMotionSafe()` from §1 so behavior is consistent and tunable from one place.

### 8.2 Testing strategy

**Automated:**
- Existing Phase 0 render + a11y smoke test continues to pass unmodified
- New: smoke test that renders the page with `useReducedMotion` mocked to return `true`, asserts that key content (hero headline, photo alt text, all 6 service names, all 3 trust strip items) is present in the DOM. Catches the failure mode where entrance motion accidentally hides content from reduced-motion users.
- `npm run typecheck` clean
- `npm run lint` clean
- `npm run build` succeeds (catches SSR mismatches in motion components)

**Not automated:**
- Animation timing/easing — visual review only. Unit-testing motion is brittle and low-signal.
- Scroll listener behavior — covered by manual browser review.

**Manual checklist before declaring done:**
1. `npm run dev`, walk through every section in Chrome at desktop width
2. Repeat at mobile breakpoint (DevTools responsive mode)
3. DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → verify all content visible, page usable
4. Lighthouse a11y score not regressed from current baseline (currently passing)
5. Test on actual mobile device (motion reads differently on a small screen)
6. `npm run build && npm run start`, smoke-test the production build (catches SSR hydration mismatches that don't appear in dev)

---

## 9. File-by-file change inventory

### New files

| Path | Purpose |
|---|---|
| `lib/motion.ts` | Easing/spring tokens |
| `lib/use-reduced-motion-safe.ts` | Reduced-motion hook |
| `components/motion/FadeUp.tsx` | Fade + slide-up primitive |
| `components/motion/Stagger.tsx` | Stagger parent + child exports |
| `components/motion/HoverLift.tsx` | Card/element hover lift primitive |
| `tests/reduced-motion.test.tsx` | Smoke test for reduced-motion content visibility |

### Modified files

| Path | Change |
|---|---|
| `package.json` | + `@phosphor-icons/react` dependency |
| `lib/site-config.ts` | Add `iconName` field to each `services` entry |
| `app/page.tsx` | Hero: photo + motion. Trust strip: icons + `<FadeUp>`. About: `<FadeUp>` + `<Stagger>` badges. Services: `<Stagger>` + per-card `<HoverLift>` + icon map. Converts to client component. |
| `components/Nav.tsx` | Scroll-aware state (`isScrolled`), throttled scroll listener |
| `components/Button.tsx` | Convert to `motion(Link)` / `motion.button`, add `whileTap` |
| `components/TrustBadge.tsx` | Wrap span in `motion.span`, add hover scale + bg tint |

### Unchanged files

`components/Footer.tsx`, `components/LeadForm.tsx`, `components/Card.tsx`, `components/Logo.tsx`, `lib/lead-schema.ts`, `lib/send-lead-email.ts`, `app/api/lead/route.ts`, `app/layout.tsx`, `app/globals.css`.

---

## 10. Risks & open questions

**Risk: SSR hydration mismatch in motion components.** Framer Motion's `useInView` reads window state. Mitigation: all motion primitives are `"use client"`. Caught by `npm run build` if it slips through.

**Risk: Phosphor bundle size.** Tree-shakes per-icon, so importing 9 icons should add ~5-10KB to the bundle. Acceptable. Verified during implementation by inspecting build output.

**Risk: Scroll listener performance.** Mitigation: `requestAnimationFrame` throttle, single boolean state change, no DOM reads beyond `window.scrollY`. Measured during manual review.

**Risk: Reduced-motion users see broken layouts if entrance animations leave elements in initial state.** Mitigation: smoke test renders the page with `useReducedMotion` mocked true and asserts content visibility. Primitives default to final state when reduced.

**Open question: Unsplash photo selection.** Will be made during implementation per the "Caring Hands" brief. User has approval right on the chosen photo before merge.

---

## 11. Predecessor spec relationship

This spec is purely **additive** to [`2026-04-17-phase-0-lead-capture-design.md`](2026-04-17-phase-0-lead-capture-design.md). No Phase 0 behavior changes. No design tokens, palette, typography, or layout grid altered. Lead form pipeline (Resend, validation, honeypot) untouched.

---

## 12. Next steps

1. User reviews this spec; requests changes if needed
2. Once approved, transition to writing-plans skill to produce an implementation plan with discrete tasks + verification gates
3. Implementation phase: create feature branch off `phase-0`, work plan task-by-task, manual review gate before merge back to `phase-0`
