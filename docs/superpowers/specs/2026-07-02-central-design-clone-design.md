# Lifecare Site — Clone Central's Design, Lifecare Blue (Decision Record)

**Date:** 2026-07-02
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Locked — building flagship (home) directly, then SDD interior pages
**Reference:** Central Home Health (live: centraloftexas.com) — local repo `~/Documents/Claude/Websites/central-home-health`. Same stack (Next 16 modified / Tailwind v4 / motion), proven in this environment → **port Central's actual component code**, adapted to next-intl. Do not write the design fresh.

**Supersedes** the Kharazmi restyle specs (`2026-07-02-kharazmi-restyle*`). The user rejected the Kharazmi direction. New target: the Lifecare site should look **exactly like Central**, with **one change** — Central's gold accent becomes **Lifecare's logo blue**. Everything else (layout, Fraunces + Inter type, photography-forward components, section compositions) matches Central 1:1. Only the brand/name/content is Lifecare's.

## Decisions locked

1. **Design = Central's, ported.** Adopt Central's `@theme` tokens, `lib/fonts.ts` (Fraunces + Inter), `components/ui/*` primitives (Container, Button, Eyebrow, Section, Stat, Card, PhotoHero, PhotoBand, CallMenu, icons), `components/home/*` section blocks, `components/layout/*` (Header/Footer/MobileNav/PhoneBar/ReferCTA), `components/motion/*`, `components/brand/Logo`. Port the JSX + Tailwind, wire to Lifecare's next-intl messages + `lib/site-config.ts` instead of Central's `content/*`.
2. **Accent = Lifecare blue (replaces gold).** Keep AA discipline. Bright care-blue is the light-value "pop" (Central's gold role); deeper blue carries AA text + the signature CTA.
3. **Keep** Lifecare's next-intl `[locale]` routing, EN messages/content, SEO (metadata/JSON-LD/sitemap/robots), and lead form. Overwrite only the design/presentation layer. Do NOT revert the Kharazmi commits — overwrite on top.
4. **Build order:** home page flagship (built directly by controller) → dev server + user visual checkpoint → THEN SDD the 8 interior pages (mechanical reuse of the confirmed pattern).

## Accent token remap (gold-role → blue) with computed AA

Replace Central's gold tokens; keep navy/canvas/slate/radius/fonts exactly as Central.

| Token | Hex | Role | AA |
|---|---|---|---|
| `--color-navy` | `#0D2B49` | dark sections, headings on light | Central exact |
| `--color-navy-deep` | `#081D33` | deepest navy surfaces / hero | Central exact |
| `--color-canvas` | `#FBFAF7` | ivory page background | Central exact |
| `--color-card` | `#FFFFFF` | cards | Central exact |
| `--color-slate` | `#5A6B7B` | secondary body text | Central exact |
| `--color-blue` | `#5A8BB8` | **accent pop** — decorative fills, hairline rules, icon tiles, non-text accents on navy (the gold-value light pop) | fills/large only |
| `--color-blue-deep` | `#2F5F8A` | **accent TEXT on light** (eyebrows/links on ivory) + **signature CTA fill (white text)** | 6.44:1 on ivory; 6.72:1 white-on-fill ✓ |
| `--color-blue-light` | `#7AA6CF` | **accent TEXT on dark navy** (eyebrows on dark sections) | 5.6:1 on navy ✓ |
| `--radius` | `8px` | Central exact |

**Discriminating check (advisor):** navy `#0D2B49` text on care-blue `#5A8BB8` fill = **3.99:1 → FAILS**. So the signature CTA does NOT mirror Central's gold-button (dark-text-on-light-fill). Instead: **`bg-blue-deep text-white`** (6.72:1). White-on-care-blue also fails (3.61:1) — care-blue never carries text; it is fills/decoration only.

**Accent split (reuse prior discipline):** care-blue `#5A8BB8` = decorative/fills/hairlines/icon-tiles (never small text); blue-deep `#2F5F8A` = accent text on light + CTA fill; blue-light `#7AA6CF` = accent text on dark navy. Focus ring: blue-deep.

**Monochrome-pop risk:** blue lacks gold's warm pop against navy. Do NOT raise abstractly — surface at the rendered visual checkpoint; if the user wants pop back, offer (a) accept, (b) a warm secondary accent, (c) larger/bolder care-blue CTA text (only ≥ large-text AA).

## Central → Lifecare reconciliations (honest content; covered entity)

- **Single phone line.** Central runs two service lines (Skilled HH + Provider Attendant Services) with two phones and a `CallMenu` that picks between them. Lifecare has **one** line — `(281) 646-9546`. Collapse `CallMenu`/`PhoneBar` to a single phone; drop the two-line framing.
- **No testimonials → OMIT the Testimonials section entirely.** Lifecare has none; do not invent quotes for a covered entity. Home composition = Central's minus Testimonials.
- **No open positions.** Careers teaser links to careers/apply generically (no fabricated roles); no live listings.
- **Facts (Lifecare):** Lifecare Options; Katy, TX (434 Park Grove Dr, 77450); phone (281) 646-9546 / fax (281) 646-9757; intake intake@mylifecareoptions.com; founded 2008; CHAP-accredited; Medicare CCN 747061; TX license 011908; Harris + Fort Bend counties. All from `lib/site-config.ts`.
- **Logo:** keep Lifecare's own logo/name (blue), not Central's.

## Scope

**In:** `globals.css` tokens, `lib/fonts.ts` + layout font wiring, port of Central's `ui`/`home`/`layout`/`motion`/`brand` components adapted to next-intl + site-config, home composition (Central's minus Testimonials), photography wiring (reuse existing `public/images/*` caregiver set; regenerate if a slot needs it).
**Out (this pass):** interior 8 pages (SDD after checkpoint), Spanish content (deferred), deployment.

## Guardrails

- WCAG AA on every text/bg pair (table above). Zero care-blue as text.
- Honest states, single phone line, no invented testimonials/positions.
- All routes build + 200 under `/en` (+ `/es` shell); tests green.
- Reduced-motion + skip-link + focus-visible preserved (ring = blue-deep).
- After build: update Obsidian "Lifecare Website" hub (design identity = Central's design system in Lifecare blue).
