---
name: Lifecare Options
description: Warm cream-and-peach home health site around the Lifecare blue, soft, family-run, phone-first.
colors:
  navy: "#2E3A50"
  navy-deep: "#253048"
  canvas: "#FBF5EE"
  card: "#FFFFFF"
  slate: "#5A6882"
  care-blue: "#5A8BB8"
  blue-deep: "#2F5F8A"
  blue-light: "#7AA6CF"
  peach: "#F2C39B"
  peach-tint: "#F9E9DB"
  border: "#e9dccb"
  surface-warm: "#f6ede2"
  alert: "#a93a2f"
typography:
  display:
    fontFamily: "Young Serif, serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Young Serif, serif"
    fontSize: "clamp(2rem, 3.5vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Young Serif, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Nunito Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Nunito Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.14em"
  caption:
    fontFamily: "Nunito Sans, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  field: "8px"
  base: "16px"
  pill: "9999px"
spacing:
  card-pad: "32px"
  card-pad-lg: "40px"
  header-gap: "20px"
  post-header: "56px"
  section-y: "80px"
  section-y-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.blue-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.navy}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.blue-deep}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-on-dark:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-on-dark-hover:
    backgroundColor: "{colors.peach-tint}"
  button-tertiary:
    textColor: "{colors.blue-deep}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.navy}"
    rounded: "{rounded.base}"
    padding: "32px"
  input:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.navy}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  badge-pill:
    backgroundColor: "{colors.peach-tint}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
---

# Design System: Lifecare Options

## Overview

**Creative North Star: "The Warm Front Door"**

Lifecare Options is a Medicare-certified home health agency in Katy, TX, and the site's visual world is built for a family arriving mid-crisis: it should feel like knocking on the door of a competent, kind household, not entering an institution. Everything sits on a warm cream canvas washed with peach, the Lifecare blue carries the actions, and a single-weight editorial serif (Young Serif) speaks in a calm, rounded voice. Density is generous and unhurried: big soft sections, pill-shaped controls, photographs with warm shadows, gentle 12px fade-up motion.

The system is deliberately a sibling, not a twin. It shares an identical layout and content skeleton with Central Home Health (centraloftexas.com) and refuses Central's skin at every layer: Central's cold navy, gold accents, and Fraunces display face are confirmed anti-references. The direction contract in `app/[locale]/layout.tsx` states it as "family-warm where Central is institutional-editorial. Same bones, different soul."

Accessibility is not aspirational here; WCAG AA is enforced programmatically by `scripts/contrast-audit.mjs`, which drives headless Chrome against every rendered route and reads browser-computed colors. Every color-pairing rule below is backed by an audited ratio.

**Key Characteristics:**
- Warm cream canvas (#FBF5EE) with peach strokes and fills; white cards float on it
- One serif, one weight: Young Serif 400, hierarchy by size only
- Pill buttons, 16px base radius, warm brown-tinted shadows with real offset and blur
- Lifecare blue reserved for actions and accent text; peach carries accent text on dark bands
- Soft, brief motion (12px rise, 0.6s, ease-out), fully disabled under prefers-reduced-motion

## Colors

A warm cream-and-peach world wrapped around the Lifecare logo blue, with a warm ink-indigo (not a cold navy) doing the reading work.

### Primary
- **Lifecare Blue Deep** (blue-deep, #2F5F8A): the workhorse accent. Accent TEXT on light backgrounds (6.2:1 on cream) and the signature CTA fill with white label text (6.7:1). Also the focus-ring color (`:focus-visible` outline site-wide).
- **Care Blue** (care-blue, #5A8BB8): the logo's lighter blue. Decorative fills, icon tiles, and card accent rules ONLY. Never text at any size.
- **Sky Blue Light** (blue-light, #7AA6CF): demoted to large-text or decorative use on dark bands only (4.24:1 on the dark band). Defined in tokens but rarely used; peach took over its accent-text-on-dark job.

### Secondary
- **Peach** (peach, #F2C39B): the brand-splitting move versus Central's gold. Decorative strokes, fills, and tiles on light backgrounds (the Eyebrow's rounded stroke, on-dark button fill), and accent TEXT on dark bands (6.8:1). Ink text on a peach fill is fine (7.1:1). Never small text on light backgrounds.
- **Peach Tint** (peach-tint, #F9E9DB): the alternating light-section background (Section tone "sky", Band) and the badge-pill fill. Ink on it reads at 9.6:1.

### Neutral
- **Warm Ink** (navy, #2E3A50): headings and body text, and the dark band background (white on it 10.9:1). A warm indigo ink, not Central's navy.
- **Deep Ink** (navy-deep, #253048): deepest band variant for hero-photo washes and footer depth.
- **Cream Canvas** (canvas, #FBF5EE): the page background.
- **Card White** (card, #FFFFFF): card and form surfaces.
- **Dusk Slate** (slate, #5A6882): secondary text. 4.7:1 on peach-tint, 5.2:1 on canvas, 5.6:1 on card. Never on raw peach (3.5:1, fails).
- **Warm Hairline** (border, #e9dccb): decorative-only hairline on cream and card surfaces.
- **Warm Well** (surface-warm, #f6ede2): tab tracks and quiet input wells.
- **Brick Alert** (alert, #a93a2f): error text. 5.8:1 on cream, 6.3:1 on card.

### Named Rules
**The Slate Constraint Rule.** Dusk Slate on peach-tint (4.7:1) is the binding contrast pair in the whole palette. Never lighten slate and never darken peach-tint; either move breaks AA, and the audit script will catch it.

**The Peach Placement Rule.** Peach is decorative on light and textual only on dark. On cream or white it may be a stroke, ring, or fill (with ink text on top); it is never itself small text on a light background.

**The Sister-Site Rule.** Never re-import Central's cold navy, gold, or Fraunces. Layout may match Central exactly; skin must never.

## Typography

**Display Font:** Young Serif (with serif fallback), loaded via `next/font` as `--font-young-serif`
**Body Font:** Nunito Sans (with sans-serif fallback), weights 400 / 600 / 700 / 800, as `--font-nunito-sans`

**Character:** A warm, rounded editorial pairing. Young Serif has soft, generous letterforms that read as handmade rather than corporate; Nunito Sans is a gently rounded humanist that keeps UI text friendly.

### Hierarchy
- **Display XL** (`text-display-xl`, 400, clamp(2.5rem, 5vw, 4rem), 1.05, -0.02em): hero-scale statements.
- **Display** (`text-display`, 400, clamp(2rem, 3.5vw, 2.75rem), 1.1, -0.015em): section titles (the Section primitive uses this for its h2).
- **Title** (`text-title`, 400, 1.75rem, 1.2, -0.01em): card headings (PillarCard h3).
- **Body** (400, 1rem, 1.5): default copy. Intros and lead paragraphs step up to 1.125rem with relaxed leading, capped around 58 to 65ch.
- **Label / Eyebrow** (700-800, 0.75rem, 0.14em tracking, uppercase): the Eyebrow and small UI labels, always Nunito Sans.
- **Caption** (`text-caption`, 0.8125rem, 1.4): payer hints and fine print.

A base-layer safety net in `globals.css` gives every bare h1 through h4 the display face, ink color, and a sane clamp size (h1: clamp(2.25rem, 4.5vw, 3.5rem)), so an unstyled heading can never regress to 16px. Components opt into the utility scale above.

### Named Rules
**The Size-Only Hierarchy Rule.** Young Serif ships exactly one weight (400). Hierarchy comes from SIZE, never from weight. Never add `font-semibold` or `font-bold` to display-face text; `font-synthesis-weight: none` on h1-h4 and `.font-display` guarantees the browser cannot fake a bold, so the class would silently do nothing.

## Layout

A single centered column: `Container` is max-width 1200px with responsive gutters (24px, 32px at sm, 48px at lg). Pages are stacks of full-width `Section` bands with generous vertical rhythm: `py-20 sm:py-28 lg:py-32` (80 / 112 / 128px). Sections alternate three tones for editorial pacing: light (cream canvas), sky (peach-tint), and dark (warm ink with white text). Section headers stack eyebrow, display title, and slate intro with a 20px gap; content follows at 56 to 64px below the header.

The hero is a bespoke split (not the Section primitive): copy and CTAs left, a 4:5 rounded photograph right, on a `lg:grid-cols-[1.05fr_0.95fr]` grid, with a soft radial blue wash behind for depth. The sticky header condenses on scroll (padding tightens past 12px of scroll and a hairline plus soft shadow appear). Desktop navigation appears at the `lg:` breakpoint (1024px); below it, a hamburger opens an inline dropdown panel. `overflow-x: clip` on html/body guards against full-bleed photo overflow without breaking the sticky header.

## Elevation & Depth

Layered and soft. Surfaces lift with warm-tinted shadows that always have a real offset and generous blur; nothing uses a flat gray drop shadow. Two tints coexist: a warm brown `rgba(94,64,32,...)` on the warmest surfaces (buttons, pillar cards, hero photo) and an ink-derived tint (from the navy token) on the generic Card. Depth also comes from tone: dark bands, gradient washes over photos, and a translucent blurred caption chip on the hero image.

### Shadow Vocabulary
- **Button lift** (`box-shadow: 0 2px 6px rgba(94,64,32,0.06), 0 14px 32px -14px rgba(94,64,32,0.28)`): the primary pill CTA.
- **Card rest** (`0 2px 4px rgb(from var(--color-navy) r g b / 0.04), 0 16px 36px -16px rgb(from var(--color-navy) r g b / 0.14)`): the Card primitive at rest; hover deepens the second layer to 0.22 alpha with a -4px lift. PillarCard uses the same geometry in the warm brown tint.
- **Photo anchor** (`0 30px 70px -28px rgba(94,64,32,0.4)`): the hero photograph, a big warm grounding shadow.
- **Floating chrome** (`0 12px 32px -12px rgba(8,29,51,0.25)`): the nav dropdown; the scrolled header uses a related `0 1px 20px -8px` glow.

### Named Rules
**The Warm Shadow Rule.** Shadows are brown- or ink-tinted, never neutral gray or pure black, and always carry a visible offset plus blur. A shadow that looks like a gray halo is off-brand.

## Shapes

Soft and rounded everywhere. The base radius is 16px (`--radius`), used on cards, photos, menu panels, and mobile-nav hit areas. Form fields step down to 8px. Buttons, badges, tab segments, the eyebrow stroke, and step markers are full pills (9999px). There are no sharp corners in the system; the only near-square elements are tiny focus-ring offsets on nav links. Card accent rules (3px top bars in care-blue or ink) follow the card's top radius. Borders are hairline and quiet: `border-navy/10` on white cards, the warm #e9dccb hairline on cream.

## Components

### Buttons
- **Character:** confident pills that invite a tap; every variant is fully rounded with a 0.97 tap-scale spring.
- **Shape:** full pill (border-radius 9999px).
- **Sizes:** md `px-5 py-2.5 text-sm`, lg `px-6 py-3.5 text-base`.
- **Primary:** Lifecare Blue Deep fill, white text, warm button-lift shadow. Hover deepens to ink.
- **Secondary:** white fill, blue-deep text, 2px inset peach ring (not a gray hairline). Hover swaps the ring to blue-deep.
- **onDark:** peach fill with ink text, for CTAs on dark bands. Hover lightens to peach-tint.
- **Tertiary:** transparent text link in blue-deep, underline on hover with 4px offset, no tap-scale.
- **Focus:** relies on the global 2px blue-deep `:focus-visible` outline.

### Eyebrow
Small uppercase tracked label above section titles, led by Lifecare's signature mark: a short rounded peach stroke (24px x 4px pill), versus Central's thin hairline. Text is blue-deep on light tones and peach on dark tones (blue-light no longer clears AA there).

### Cards / Containers
- **Corner Style:** 16px (`var(--radius)`); PillarCard uses the equivalent `rounded-2xl`.
- **Background:** white on cream.
- **Border:** hairline `border-navy/10`; hover nudges to /15.
- **Shadow Strategy:** card-rest vocabulary above; hover adds a 4px lift (`hover:-translate-y-1`) over 300ms ease-out.
- **Internal Padding:** 32px, stepping to 40px at sm.
- **Accent option:** 3px top rule in care-blue or ink.

### Badge Pills
Peach-tint pills with bold 13px ink text (`rounded-full bg-peach-tint px-3.5 py-1.5`), used for accreditation and license credentials in the hero.

### Inputs / Fields
- **Style:** 8px radius, warm hairline border (#e9dccb), translucent warm well fill (`bg-surface-warm/60`), 16px x 12px padding, ink text, slate placeholder at 60%.
- **Focus:** border shifts to ink and the fill turns fully opaque warm well; no glow.
- **Error:** Brick Alert (#a93a2f) text.
- **Segmented tabs:** a pill track in surface-warm with the active segment as an ink pill with white text.

### Navigation
Sticky, translucent cream (`bg-canvas/90 backdrop-blur-md`), condensing on scroll. Desktop (lg and up): 0.95rem medium links in ink at 80% opacity, with a 1px blue-deep underline that grows from the left on hover/focus; a hairline divider, tabular-nums phone link, and a primary pill "Refer" CTA sit at the right. The Services entry is a link plus an accessible disclosure chevron opening a 16px-radius canvas panel. Mobile: an 11x11 rounded hamburger opens an inline panel where top-level links render in Young Serif at xl size.

### Section (signature primitive)
The page-building band: tone prop (`light` cream, `sky` peach-tint, `dark` warm ink), optional eyebrow, display-size h2 (white on dark), and slate intro (white/75 on dark), optionally centered. All standard pages are stacks of Sections; only the hero and Band break pattern.

### Motion
- **FadeUp:** content fades and rises 12px over 0.6s with `cubic-bezier(0.22, 1, 0.36, 1)`, once, triggered 10% before entering the viewport. Groups cascade with 0.08s stagger (0.1s per word for staggered headlines).
- **Tap:** buttons scale to 0.97 over 0.15s ease-out.
- **Springs:** `softSpring` (stiffness 120, damping 18) for anything springy; `easeOut` (0.5s, `cubic-bezier(0.16, 1, 0.3, 1)`) for settles.
- **Reduced motion:** FadeUp renders a plain static element with no transform, no observer, no animation.

## Do's and Don'ts

### Do:
- **Do** build pages as Section bands alternating canvas, peach-tint, and dark ink tones with 80 to 128px vertical padding.
- **Do** use blue-deep for accent text and CTAs on light, and peach for accent text and CTAs on dark. Those are the only two accent-text colors.
- **Do** keep every button a full pill and every card at 16px radius with a warm-tinted offset shadow.
- **Do** lead section headers with the Eyebrow and its 24x4px rounded peach stroke.
- **Do** run `scripts/contrast-audit.mjs` against the running site after any color or text-size change; AA is enforced, not suggested.
- **Do** honor prefers-reduced-motion by rendering final state with no transform (FadeUp already does; new motion must too).

### Don't:
- **Don't** put `font-semibold` or `font-bold` on Young Serif text; the single 400 weight plus the font-synthesis guard means size is the only hierarchy tool.
- **Don't** set peach as small text on light backgrounds, slate on raw peach, or care-blue as text anywhere; blue-light is large or decorative on dark only.
- **Don't** re-import Central's cold navy, gold, or Fraunces, and don't diverge from Central's layout skeleton either; the brands split on skin, not structure.
- **Don't** use neutral gray or black shadows, square corners, or rectangular buttons.
- **Don't** invent testimonials, payer-name marketing claims, or a second phone number; honest states are part of the visual voice (empty is empty).
