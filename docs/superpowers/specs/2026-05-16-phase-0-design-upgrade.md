# Lifecare Options — Phase 0 Design Upgrade

**Date:** 2026-05-16
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Spec ready for plan
**Relationship to prior work:** Refines the live Phase 0 site (`2026-04-17-phase-0-lead-capture-design.md`). Does not replace it. Does not begin Phase 1 (the full 16-page marketing site).

---

## 1. Context

The Phase 0 lead-capture site is shipped, deployed, and working. An impeccable critique on 2026-05-16 found it competent and on-spec but visually generic — most design choices landed in the trained-on AI defaults for healthcare brands (Playfair Display, navy + teal, hero-metric trust stats, six-card service grid). The deterministic detector returned clean (no surface AI-slop code patterns), but the strategic-level choices read as templated.

This spec captures a design upgrade that keeps the Phase 0 architecture, content, and engineering posture, while replacing the visual system with a distinctive editorial direction the team picked through structured comparisons.

## 2. Goals

- Replace the AI-default visual system with a committed editorial direction that is unmistakably Lifecare, not generic healthcare.
- Make the phone number the page's primary call-to-action across hero, nav, form, and footer (per the audience-#1 finding in the critique).
- Fix a real bug where off-screen sections render `opacity: 0` for any viewer that doesn't scroll (search crawlers, link previews, print/PDF, reduced-motion users on first render).
- Resolve all surgical findings from the critique (em dashes site-wide, `#fff` body bg, token drift, TBDs, spacing monotony, container-width inconsistency).
- Keep all Phase 0 routes, content, copy, schema, API, accessibility posture, and test coverage intact.

**Success criteria:**
- A returning visitor recognizes the brand as "the warm peach-cream Katy agency," not "another healthcare website."
- Lighthouse Performance stays ≥ 90 on mobile (current target).
- WCAG 2.1 AA contrast on the new palette pairings.
- Zero new TODOs or `[TBD]` strings visible to users in production.
- All existing tests still pass; new tests cover the motion-visibility fix.

## 3. Out of scope

- Any new routes (service detail pages, About, FAQ, etc. — Phase 1).
- New illustration commissions beyond the existing pencil sketch.
- Database, CRM, or scheduling integrations.
- A redesigned LeadForm field set (fields stay; only styling and tab affordance change).
- Replacing the existing intake/jobs email flow.
- Changes to the API contract at `/api/lead`.
- New motion primitives beyond fixing the existing FadeUp/Stagger/StaggerWords visibility bug.

## 4. Design system

### 4.1 Color strategy: Committed warm (peach-cream as the brand surface)

The brand commits to peach-cream as the dominant page surface. Navy is the ink. Architectural contrast at top (announcement bar) and bottom (footer) provides closure.

| Token | Value | Role |
|---|---|---|
| `--color-cream` | `#fdeedd` | Primary page surface (replaces `bg-white` everywhere except where called out below) |
| `--color-navy` | `#0f2b47` | Primary ink, announcement bar, footer, primary CTAs |
| `--color-care-blue` | `#5a8bb8` | Small accents only (focus rings, list numerals, eyebrows, separator dots). Never a primary surface. |
| `--color-cream-deep` | `#f0dcb8` | Optional deeper warm tint for illustration backgrounds and tactile elements |
| `--color-cream-edge` | `#ead8b6` | Hairline borders on cream surfaces |
| `--color-mist` | (drop) | Removed from the page palette. Phase 0 uses navy-or-cream architectural contrast; mist is redundant. |
| `--color-slate` | `#5a6b7e` | Body subtext on cream surfaces (slightly cooler than current, tuned for cream-bg contrast) |
| `--color-success-green` | `#2d6a4f` | TrustBadge text (kept) |
| `--color-alert-red` | `#9a2f24` | Inline form error text and the "Now offering" RPM eyebrow accent |
| `--color-borderline` | (deprecate) | Replaced by `--color-cream-edge` on cream and `rgba(253,238,221,0.18)` on navy |

**Tinted neutrals rule:** never use pure `#fff` or `#000` anywhere. The body background becomes `--color-cream`. Where a card or input needs to sit above the cream, it uses pure white (`#ffffff` is acceptable when sitting on a cream parent — the contrast is what makes the paper feel paper). The footer-muted color (currently raw hex `#a8b8cc`) becomes a tokenized `--color-footer-muted: rgba(253, 238, 221, 0.65)`.

### 4.2 Typography

| Family | Role | Weights | Source |
|---|---|---|---|
| Spectral | Display, headings, italics, oldstyle numerals | 400, 500, 600, 400-italic, 500-italic | next/font (Google Fonts) |
| Albert Sans | Body, UI, labels, buttons | 400, 500, 600 | next/font (Google Fonts) |
| Playfair Display | (remove) | — | unload |
| Inter | (remove) | — | unload |

**Modular scale:** ≥1.25 between display steps. Body 17px (kept). Headings use `clamp()` for fluid sizing:

- H1: `clamp(2.5rem, 6vw, 4rem)` — Spectral 500, italic available for the "felt" emphasis word in hero
- H2: `clamp(2rem, 4.5vw, 3rem)` — Spectral 500
- H3: `1.5rem` — Spectral 500
- Body: `1.0625rem / 1.65` — Albert Sans 400
- Eyebrow: `0.75rem` Albert Sans 600, letter-spacing 0.18em, uppercase
- Italic uses: hero emphasis word, trust-strip pull-quote, service-discipline names in the numbered list, footer signoff hint

**Body line-length cap:** 65–75ch. Paragraphs constrain to `max-w-prose`.

### 4.3 Spacing rhythm

Vary section padding (kill the current uniform `py-20 md:py-24`):

| Section | Mobile | Desktop |
|---|---|---|
| Hero | `py-12` | `py-28` |
| Trust strip (pull-quote) | `py-8` | `py-12` |
| About band | `py-16` | `py-32` |
| Services | `py-16` | `py-24` |
| Form | `py-16` | `py-28` |
| Footer | `py-12` | `py-14` |

### 4.4 Motion

**Bug fix is in scope** (see §6). After the fix:

- Entrance animations enhance from a visible baseline, not from `opacity: 0`. Content is always present in the DOM-rendered output.
- The existing transitions (`easeOut`, `softSpring`, `staggerChildren`, `staggerWords`) stay.
- Word-by-word reveal on H2s stays — it is one of the page's best craft moments.
- HoverLift stays for buttons and the numbered-list rows.

### 4.5 Iconography

Phosphor duotone icons are **removed from the services section** (the numbered list does not use icons). They are kept in the hero CTAs (a small handset glyph next to "Call (281) 646-9546") and the announcement bar (Heartbeat for RPM). The shield/house/phone icon trio in the current trust strip is dropped (the trust strip becomes a text-only pull-quote).

## 5. Page-by-page changes

The page keeps its current section order. Each section's treatment changes as below.

### 5.1 AnnouncementBar

**Before:** peach-cream surface, navy text, Heartbeat duotone icon, "Now offering Remote Patient Monitoring."

**After:** navy surface (`--color-navy`), cream text (`--color-cream`), Heartbeat icon in cream. Same copy. The architectural contrast — navy at the very top, peach-cream from the nav down — bookends the page against the navy footer.

### 5.2 Nav

**Before:** white surface, hamburger on mobile (phone hidden inside), "Request info →" pill on desktop.

**After:**
- Cream surface (`--color-cream`) with subtle backdrop-blur on scroll
- **Phone number is visible on both desktop AND mobile** — a small navy pill chip `(281) 646-9546` sits next to the logo on mobile (no hamburger needed for the phone affordance)
- Hamburger still exists but only opens supplemental links (currently empty in Phase 0 — keep the hamburger for Phase 1 future-proofing but the menu is now optional, not the only path to the phone)
- "Request info →" pill stays on desktop only

### 5.3 Hero

**Before:** asymmetric split, eyebrow + Playfair H1 + subhead + Request-info-primary + Call-secondary, sketch on right.

**After:**
- Same asymmetric split layout
- Eyebrow stays: "Home Health · Katy, TX"
- H1: "Quality care, *felt* at home." (`felt` set in Spectral italic 400; the rest in Spectral 500)
- Subhead in Albert Sans, no em dashes (use commas and periods)
- **CTA order flipped:** "📞 Call (281) 646-9546" is now primary (navy fill, cream text); "Request info ↓" is secondary (ghost button, navy outline)
- Hero illustration stays. The pencil sketch is one of the page's strongest design moves and is keeping it.

### 5.4 Trust strip → Editorial pull-quote

**Before:** mist surface, 3 icon-stacked-over-stat blocks (Medicare-certified / Serving Katy since 2008 / 24/7 on-call nursing).

**After:**
- Cream surface (continuous with hero), 1px navy rule at 18% opacity above and below
- Eyebrow "Credentials" in tracked uppercase Albert Sans
- One Spectral italic sentence: **"*Medicare-certified.* CHAP-accredited. Serving *Katy* families since 2008."**
- No icons. Asymmetric, left-aligned, set inside `max-w-7xl` container
- The bolded/italic emphasis pattern provides reading rhythm

### 5.5 About band

**Before:** two-column on desktop — left: Playfair H2 + paragraph; right: four green TrustBadges in a flex-wrap row.

**After:**
- Same two-column structure
- H2: "Serving Katy families *since 2008*." (Spectral, with italic on "since 2008")
- Paragraph in Albert Sans, em dashes replaced
- TrustBadges keep their green-pill shape but the typography becomes Albert Sans 500 (was Inter). Hover scale stays.

### 5.6 Services section → Numbered editorial list

**Before:** mist-bg section, eyebrow + Playfair H2 + subhead, then RPM featured peach card + 6-card grid with mechanical `i % 3` variant rotation (white/mist/peach).

**After:**
- Cream surface (continuous)
- Eyebrow "Our services"
- H2: "*Seven* disciplines, one coordinated plan." (Spectral with italic on "Seven")
- Subhead in Albert Sans, em dash removed
- **RPM as a "Now offering" ribbon** on top: white paper card with a red-clay eyebrow ("Now offering"), discipline name "*Remote Patient Monitoring*" in Spectral italic, one-line description
- **6 standard disciplines as a 2-column numbered list:**
  - 01–06 in care-blue Spectral 500, oldstyle numerals
  - Discipline name in Spectral 500 (e.g., "Skilled Nursing")
  - Description in Albert Sans 400, slate-on-cream, no em dashes
  - Hairline navy/12% rule beneath each row
  - On mobile: single column
- No icons, no card boundaries, no `bg-mist` background, no variant rotation

### 5.7 Form section → Tightened current

**Before:** white surface, `max-w-2xl` container (narrower than the rest of the page), Bootstrap-era `border-b-2` tab underline, default-styled inputs.

**After:**
- Cream surface (continuous) with a single white paper card holding the form (`bg-white`, `rounded-lg`, subtle paper shadow)
- Container width: `max-w-3xl` (a touch wider than today but still constrained; centered within the `max-w-7xl` section wrapper so it feels intentional, not marooned)
- Section heading: "Get in touch." (Spectral 500)
- Sub-line: "Or call us directly — **(281) 646-9546**, answered 24/7." (Albert Sans, phone in 600 weight)
- **Tabs become rounded-pill segmented control:** light cream-tint background, active tab fills navy with cream text. Kills the underline. Sits inside the paper card at top.
- **Inputs:** larger (py-3 minimum, text-base), peach-cream-tinted background (`--color-cream`), navy 1.5px border, navy focus state (no blue ring; just border-color shift + 2px navy outline-offset). Labels in Albert Sans 600.
- **Submit:** navy fill, cream text, pill shape (matching the Button primary)
- Honeypot, validation, submit state, thank-you state all kept as-is

### 5.8 Footer → Architectural navy (sharpened)

**Before:** navy surface, three equal columns (contact / hours / accreditation), raw hex `#a8b8cc` muted text, Inter body, small "Logo + address" stack.

**After:**
- Navy surface (kept — provides closure to the warm page above)
- Three columns with a `1.4fr 1fr 1fr` ratio (contact gets more room)
- **Contact column:** Logo (cream-on-navy variant), then phone number large in Spectral (`text-2xl md:text-3xl`), "Always answered" eyebrow in tracked uppercase, then address
- **Hours column:** "Hours" label, then time lines with italic times (Spectral italic)
- **Accreditation column:** "Accreditation" label, then 4 credential lines
- Copyright row at the very bottom: tracked uppercase, low-opacity
- All raw `#a8b8cc` references replaced with `--color-footer-muted` token

## 6. Motion visibility bug fix

A critical bug discovered during the visual pass: `FadeUp`, `Stagger`, and `StaggerWords` gate visibility on `useInView`, which means any viewer that doesn't scroll (search crawlers without scroll, social-card link previews, Save-as-PDF / Reader Mode, accessibility tools, browser screenshot APIs) sees blank sections. The current `useReducedMotionSafe` hook only kicks in after hydration; first paint is still `opacity: 0`.

**Fix:**

- `initial` opacity in all three primitives becomes `1` (visible).
- The motion props animate `from {opacity: 1, y: 0} to {opacity: 1, y: 0}` when `inView` or `reduced` — i.e., no animation, no visible regression.
- The fade-up effect is achieved by setting `initial={{ y: 16 }}` and animating `y` only, with opacity always 1. (Subtler entrance — less visual flicker — without the visibility risk.)
- **Alternative considered:** SSR-render the visible state and only enable hidden-then-animate on the client after hydration. Decided against: more wiring, and the simpler "always visible, only translate" approach delivers the same craft moment without the bug.
- Tests: add a Vitest unit that renders each motion component without scrolling and asserts `opacity: 1` on the rendered output.

## 7. Surgical fixes (separately from the design upgrade, but bundled in this work)

The critique flagged surgical items that don't require design discussion. They ship with this upgrade:

| # | Issue | Fix |
|---|---|---|
| 1 | Em dashes site-wide (hero subhead, about, service descriptions, featured RPM, footer) | Site-wide replace: hero/about use commas + periods; service descriptions become single-clause sentences; featured RPM rewords to drop the dash; footer "—" becomes "·" |
| 2 | `#fff` body background | Replaced by `--color-cream` |
| 3 | Raw `#a8b8cc` in Footer | Replaced by `--color-footer-muted` token |
| 4 | `[TBD]` placeholders in `lib/site-config.ts` (`medicareCcn`, `stateLicense`) | Replaced with real values before launch. Until provided, fields are omitted from the rendered footer rather than shown as `[TBD]`. Comment in code points to the source-of-truth doc. |
| 5 | Spec drift: spec says 6 services, code ships 7 (RPM added) | This spec captures the 7-service reality. The old Phase 0 spec gets a top-of-file note pointing to this one. |
| 6 | Spacing monotony (`py-20 md:py-24` everywhere) | Per-section padding from §4.3 |
| 7 | Sections clip under sticky nav on direct-link scroll (`#contact` anchor today; future anchors as Phase 1 lands) | Add `scroll-margin-top: 5rem` to every `<section>` with an `id` attribute, plus the form-section wrapper |
| 8 | `peach` Card variant has no border (inconsistent with white/mist) | Card component is removed from the services section entirely; for any remaining uses, add `--color-cream-edge` border to peach variant |
| 9 | Mobile menu has no Esc-close, no focus trap, no body-scroll lock | Add `useEffect` for Esc, focus-trap (or `inert` on background), `overflow: hidden` on `<body>` while open |
| 10 | LeadForm submit button uses Button component but loses size context after disabled | Confirm `Button size="lg"` survives the disabled state; tweak `disabled:opacity-50` if needed |

## 8. Component changes

| Component | Change |
|---|---|
| `app/globals.css` | New tokens per §4.1; remove `--color-mist`, `--color-borderline`; body bg → cream; default `h1–h4` → Spectral; default body → Albert Sans |
| `lib/fonts.ts` | Replace Playfair + Inter with Spectral + Albert Sans (next/font/google) |
| `components/AnnouncementBar.tsx` | Surface → navy; icon + text → cream |
| `components/Nav.tsx` | Surface → cream; add visible mobile phone chip beside logo; tighten button styling |
| `components/HeroIllustration.tsx` | No change (illustration is locked, loved) |
| `components/Button.tsx` | Primary fill → navy; secondary → ghost-navy on cream; sizes kept |
| `components/Card.tsx` | Keep for backwards compat; add `cream-paper` variant; `peach` variant gets a border. Not used in new Services section. |
| `components/TrustBadge.tsx` | Typography → Albert Sans; keep green pill |
| `components/Footer.tsx` | Per §5.8 |
| **New:** `components/TrustSentence.tsx` | The editorial pull-quote (§5.4) |
| **New:** `components/ServicesList.tsx` | The numbered editorial list (§5.6) |
| `components/LeadForm.tsx` | Per §5.7 — pill tabs, larger inputs, cream-tinted backgrounds, navy focus |
| `components/motion/FadeUp.tsx` | Per §6 — initial visible |
| `components/motion/Stagger.tsx` | Per §6 — initial visible |
| `components/motion/StaggerWords.tsx` | Per §6 — initial visible |
| `app/page.tsx` | Restructured to use TrustSentence + ServicesList; section paddings updated; Phosphor icon imports for services removed |

## 9. Testing

Existing test coverage stays. New tests:

- `lead-schema.test.ts` — unchanged
- `api-lead.test.ts` — unchanged
- `LeadForm.test.tsx` — update tab markup query (rounded-pill replaces `border-b-2`); test that submit button text still says "Request info →" / "Submit inquiry →"
- **New:** `FadeUp.test.tsx`, `Stagger.test.tsx`, `StaggerWords.test.tsx` — each renders the component outside the viewport and asserts the children are present with `opacity: 1` styles
- **New:** `Nav.test.tsx` — assert phone chip is visible at mobile breakpoint without opening the menu
- **New:** `ServicesList.test.tsx` — assert 7 disciplines render (1 RPM ribbon + 6 numbered), description text matches `site-config.ts`

Lighthouse and axe-core: spot-check pre-merge; no new automation in this spec.

## 10. Acceptance criteria

This work is done when:

1. The seven design decisions in §4–§5 are visually shipping in `phase-0` branch (or a child branch off it).
2. All ten surgical fixes in §7 are merged.
3. The motion visibility bug is fixed and covered by tests.
4. `npm run build`, `npm run typecheck`, `npm run lint`, `npm test` all green.
5. Lighthouse Performance ≥ 90 on mobile (current target).
6. WCAG 2.1 AA contrast verified for: navy-on-cream body, slate-on-cream subtext, cream-on-navy footer, care-blue numerals on cream, alert-red error text.
7. Body background is `--color-cream`. No pure-white surfaces except inside the form's paper card and the navy footer's interior elements where contrast requires it.
8. `impeccable critique` re-run shows: AI-slop verdict turns from "softly yes" to "no"; reflex-reject font check passes; identical-card-grid finding cleared.
9. Manual QA: page renders correctly with JavaScript disabled (motion components do not gate content); link-preview-generator screenshot of the homepage shows the trust pull-quote and service section.

## 11. TBD before launch

- [ ] Medicare CCN number — for `lib/site-config.ts`
- [ ] Texas state license number — same
- [ ] Final copy review on the new trust pull-quote — owner approves wording
- [ ] Final copy review on the footer signoff line — owner approves wording
- [ ] Confirm pencil-sketch illustration is the version we ship (no replacement)

## 12. Principles

- **The brand is warm. The page is one continuous warm surface, bookended by architectural contrast.**
- **One typeface family for ink, one for voice.** Spectral carries the brand. Albert Sans gets out of the way.
- **The phone number wins.** Every section reinforces it.
- **No section hides its content.** Visibility never depends on motion or scroll.
- **No em dashes.** Commas, colons, periods, parentheses.
- **No mechanical patterns.** No `i % 3`, no identical-card grids, no centered-stack defaults inherited from training data.
- **Inherit the engineering posture.** Lead-capture works, accessibility holds, tests pass, no new dependencies beyond fonts.
