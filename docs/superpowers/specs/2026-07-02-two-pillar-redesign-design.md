# Lifecare Options — Complete Two-Pillar Redesign

**Date:** 2026-07-02
**Status:** Approved (design brainstorm with Clint, 2026-07-02)
**Branch basis:** `feat/full-site` tip (`4085487`)

## 1. Goal

Rebuild the entire site — every page, every component — onto one coherent,
top-tier design system (the navy flagship identity shipped for the home page
on 2026-07-02), and restructure the offering around **two equal service
pillars**: Skilled Home Health and Provider Attendant Services (PAS).

This is a complete redesign, not a patch. Nothing from prior design
directions (Playfair/care-blue template, Kharazmi amber/Plus Jakarta)
survives except by deliberate inclusion.

## 2. Why now — the readability regression

The 2026-07-02 flagship commit rebuilt only the home page on the new design
system and removed legacy tokens. The 8 inner pages still reference the old
styles, producing real defects:

1. **Inner-page h1s render at body size** (~16px serif) — hero headlines on
   Services, About, Contact, Careers are effectively unreadable as titles.
2. **Dark navy sections lose content** — "Conditions We Support" on
   /services renders as a navy void with a washed-out eyebrow and no visible
   heading.
3. **Identity collisions** — amber Kharazmi "Call" buttons sit inside the
   navy/blue system; the /services hero photo panel renders an empty
   gradient (missing image).

The fix is structural: one design system, enforced in components, with a
programmatic contrast gate.

## 3. Decisions (approved)

| Decision | Choice |
| --- | --- |
| Design direction | Elevate the navy flagship (Fraunces + navy + Lifecare blue) |
| Service architecture | Two pillars, equal weight: Skilled HH and PAS |
| PAS payer claims | Medicaid PHC/CAS/FC, Medicaid managed care (STAR+PLUS), private pay. **No** LTC-insurance or VA claims. |
| Approach | Full-system rebuild (all pages at once, not incremental patching) |
| Languages | Full EN + ES parity maintained throughout |

## 4. Information architecture

```text
/                            Home — reframed around two pillars
/services                    Services hub — two-pillar router page
/services/skilled            Skilled Home Health (nursing, PT, OT, ST, MSW, aide, RPM)
/services/attendant          Provider Attendant Services (NEW)
/service-area                Restyled, same scope
/about                       Restyled; story covers both lines
/careers                     Restyled; two hiring audiences (clinical + attendant)
/refer                       Restyled; referral paths for both lines
/contact                     Restyled
/remote-patient-monitoring   Kept at existing URL, presented under skilled pillar
/accessibility               Restyled
```

- **Nav:** `Services` becomes a dropdown (Skilled Home Health / Attendant
  Services / Remote Patient Monitoring). All other items flat. Phone +
  "Refer a Patient" CTA remain in the header.
- **Home two-pillar split:** the "Skilled Clinical Care / Support & Daily
  Living" cards become true pillars. Home Health Aide moves **inside**
  skilled (Medicare-certified aide benefit). The attendant card carries
  daily-living tasks (bathing, dressing, meals, light housekeeping, errands).
- Existing URLs do not change; only `/services/skilled` and
  `/services/attendant` are new routes.

## 5. Design system

### Type

- **Fraunces** (display serif) + **Inter** (UI/body).
- Single type scale, defined once and consumed everywhere:
  `display-xl` (hero ~64px) → `display` (section ~44px) → `title` (~28px)
  → body 17px/relaxed → `caption`. Pages do not declare ad-hoc heading sizes.

### Color

- Navy `#0D2B49`, navy-deep `#081D33`, warm ivory canvas `#FBFAF7`, white cards.
- Lifecare blue in three enforced roles:
  - `blue-deep #2F5F8A` — accent text on light backgrounds + primary CTA fill
  - `blue-light #7AA6CF` — accent text on navy
  - `care-blue #5A8BB8` — decorative only (fills, hairlines, icon tiles); never small text
- New: soft sky wash `#EAF2F9` for alternating light sections.
- **Deleted:** amber, mist, and all Kharazmi/Playfair-era tokens.

### Section grammar

- Pages alternate ivory → white/sky → navy bands, generous vertical rhythm.
- Every band uses the same header stack: hairline + eyebrow → Fraunces
  headline → intro.
- Dark bands enforce `blue-light` eyebrow + white text **inside the Section
  component** — navy-on-navy text becomes structurally impossible.

### Components (canonical set; everything else deleted)

Button (primary blue-deep fill / secondary outline / on-dark inverted),
Card, Stat, Eyebrow, Hero (home flagship variant with photo panel +
floating badges; interior variant with compact photo treatment and real
images wired in), Band (navy CTA strip), **PillarCard** (new, service
lines), **StepList** (1-2-3 flows), Testimonial, **PayerList**, ServiceMap.

### Imagery

Existing AI caregiver photo set, art-directed consistently (warm light,
home settings). Attendant-line imagery (daily-living scenes) visually
distinct from clinical imagery (scrubs/stethoscope scenes).

### Motion

`motion/react`: soft fade-up staggers on section entry, hover lifts on
cards. `prefers-reduced-motion` honored everywhere.

### Accessibility

Hard AA gate: every text/background pair ≥ 4.5:1 (3:1 for large display
text), verified programmatically against rendered pages (§8), not eyeballed.

## 6. Page-by-page design

### Home

1. Hero — headline, photo panel + floating trust badges, dual CTA
   (Refer a Patient / Call), CHAP + TX-license trust line.
2. Navy trust band — 14 / 6 / 19 / 7 stat row; licensing sentence extended
   to mention attendant care.
3. **Two-pillar section** — PillarCards side by side: Skilled Home Health
   (Medicare-certified; nursing, PT/OT/ST, MSW, aide, RPM) vs Provider
   Attendant Services (Medicaid PHC/CAS/FC · STAR+PLUS · private pay;
   daily-living tasks). Each deep-links to its pillar page.
4. "When you call" StepList — copy works for both a hospital-discharge
   family and a Medicaid attendant-care family.
5. Why Lifecare — navy differentiators band with testimonial.
6. Service-area teaser (map) + careers teaser ("hiring nurses *and*
   attendants").
7. Final CTA band + LeadForm.

### /services (hub)

Short router page: hero → two expanded PillarCards with full service lists
→ "not sure which you need?" plain-language explainer strip (recovering
from something → skilled; help with everyday tasks → attendant) → payers
strip → CTA band.

### /services/skilled

Interior hero (clinical imagery) → seven discipline cards (existing
content, restyled) → Conditions We Support chips on navy (rebuilt,
readable) → insurance list (Medicare, Medicare Advantage, Medicaid,
commercial, private) → how-care-starts StepList → CTA.

### /services/attendant (new)

Interior hero (daily-living imagery) → "what an attendant helps with" task
grid (bathing, dressing, grooming, meals, light housekeeping, laundry,
errands, escort to appointments) → **two-path eligibility explainer**:
Medicaid path (PHC/CAS/FC, STAR+PLUS; "we help you navigate
qualification") vs private-pay path (start right away, flexible hours) →
what-to-expect (care plan, supervisory visits, consistent attendant) →
attendant-careers cross-link band → CTA.
Constraints: no LTC/VA claims, no outcome guarantees.

### /about

Story updated to cover both lines ("skilled recovery care and long-term
daily support"), mission, commitments band (bilingual-care commitment
stays), credentials strip (CHAP, Medicare-certified, TX license 011908,
CCN 747061 — flagged verify-before-launch).

### /careers

Two hiring audiences with anchor nav: **Clinical roles** (RN/LVN/PT/OT/ST/
MSW) and **Attendant roles** (volume hire; emphasize steady hours and a
no-experience path; pay-cadence claims only if verified truthful). Shared
"why work here" + application flow into the existing LeadForm jobs tab.

### /service-area, /refer, /contact, /remote-patient-monitoring, /accessibility

Same content scope, fully restyled on the system. Refer gains a
community-referral line (attendant care is not physician-referral-gated).
RPM framed as part of the skilled pillar. Contact keeps the map (CSP
already allows it).

### SEO (all pages)

Per-page metadata + hreflang preserved; JSON-LD updated so
`availableService` covers both lines; sitemap regenerated with new routes.

## 7. Content & copy rules

- Every new string lands in `messages/en.json` **and** `messages/es.json`
  in the same commit; ES mirrors approved EN.
- De-AI-cliché pass on all new copy (no "Built by X, for Y" constructions,
  no hollow buzzwords, no em-dash tics).
- No outcome guarantees, no unverifiable claims, no payer claims beyond §3.
- CCN `747061` / TX license `011908` remain flagged verify-before-launch.
- Resolve the existing stat contradiction: home trust band says "14 years
  serving Katy" while About says "since 2008" (18 years as of 2026). Derive
  the years figure from the founding year in one place, or confirm the
  correct founding year with Clint during implementation.

## 8. Technical plan

**Workspace:** the `feat/full-site` worktree at
`~/Documents/Claude/Projects/lifecare-full-site`. Phase-0 WIP (hero-video
work in the main checkout) is untouched. Work branches off the
`feat/full-site` tip.

**Build order** (each step leaves typecheck, lint, tests, build green):
1. Design-system pass — final tokens (delete amber/mist/legacy), type
   scale, canonical components incl. PillarCard/StepList/PayerList; wire
   real hero imagery.
2. Home reframe onto two pillars.
3. Services hub + both pillar pages (attendant page incl. new EN + ES copy).
4. Remaining seven pages rebuilt in sequence.
5. SEO pass — metadata for new routes, JSON-LD `availableService` for both
   lines, sitemap.
6. Final gates (§9).

**Stack discipline:**
- Next.js 16: read `node_modules/next/dist/docs/` before coding (repo
  `AGENTS.md`); no training-data assumptions.
- next-intl v4 routing; full EN/ES parity.
- `motion/react` for animation.
- iCloud gotcha: if `tsc` fails on phantom `* 2.ts` files under `.next`,
  delete them (known issue, same as Central).

## 9. Verification gates

- **Per-page tests:** vitest + testing-library smoke test and vitest-axe
  zero-violations check for every route.
- **Contrast audit:** programmatic AA check — walk every rendered page,
  extract computed text/background pairs, assert ≥ 4.5:1 (3:1 large text).
- **Visual review:** full-page screenshots of all 11 routes × EN/ES at
  desktop + mobile widths, reviewed before completion is claimed.
- **Copy review:** cliché/claims pass per §7.

## 10. Out of scope

- Deployment / DNS for mylifecareoptions.com (separate task; currently no
  live deploy).
- The phase-0 hero-video WIP (user's work in progress).
- Any intake/Vesta integration.
- Logo redesign (existing logo and lockup are kept).
