# Lifecare Warm — Restyle Away From Central (Design)

**Date:** 2026-08-05
**Status:** Approved (brainstorm + live comp reviewed by Clint, 2026-08-05)
**Owner:** Clint Ives
**Supersedes:** the "exactly like Central, gold→blue" clause of `2026-07-02-central-design-clone-design.md`. Layout/content parity with Central REMAINS; visual-skin parity ENDS.

## Goal

Central (centraloftexas.com) and Lifecare currently share one design system; they read as the same site reskinned. Keep the layout and content identical, make the skin unmistakably Lifecare: soft & warm — peach/cream around the existing Lifecare blue, Young Serif + Nunito Sans, rounded/gentle detailing. Approved via live comp (scratchpad `comp/index.html`, served 2026-08-05).

## Locked decisions

1. **Brand feel:** softer & warmer (family caregiving), vs Central's editorial-institutional.
2. **Palette:** peach & cream around Lifecare blue. Verified AA (computed 2026-08-05):

| Token (name kept / new) | Old value | New value | Key contrast |
|---|---|---|---|
| `--color-navy` (ink + dark bands) | #0D2B49 | **#2E3A50** | 10.6 on canvas; white on it 10.9 |
| `--color-navy-deep` | #081D33 | **#253048** | deeper band variant |
| `--color-canvas` | #FBFAF7 | **#FBF5EE** | warm cream |
| `--color-card` | #FFFFFF | #FFFFFF | ink on card 11.4 |
| `--color-slate` | #5A6B7B | **#62708A** | 4.6 on canvas ✓ |
| `--color-sky-soft` → **`--color-peach-tint`** | #EAF2F9 | **#F9E9DB** | ink on it 9.6 |
| **`--color-peach`** (new) | — | **#F2C39B** | decorative fills/strokes; ink on it 7.1; on dark 6.8 ✓ |
| `--color-care-blue` | #5A8BB8 | unchanged | fills only (unchanged rule) |
| `--color-blue-deep` | #2F5F8A | unchanged | accent text + CTA; 6.2–6.7 ✓ |
| `--color-blue-light` | #7AA6CF | unchanged | **demoted: large-text/decorative on dark only** (4.24 on new dark); peach replaces it for small accent text on dark |
| `--radius` | 8px | **16px** | |

3. **Type:** Young Serif (display, single 400 weight — hierarchy by size) + Nunito Sans (400/600/700/800). Same scale slots; display-xl ~60px (Young Serif runs wide).
4. **Detailing:** pill buttons; soft warm shadows (larger blur, warm tint, real offset); Eyebrow hairline → short peach stroke; BrandMotif glows warm; dark-band accents peach; motion becomes gentle fade/soft-rise; announcement bar text peach.
5. **Bug fix folded in:** nav overlap at ~1000px (logo/links/phone collision).

## Explicitly unchanged

Routes, section order, all copy, nav/footer content, lead pipeline, SEO/JSON-LD/sitemap, compliance rules, ES-disabled state, honest-states policy (no testimonials/positions), single phone line.

## Out of scope

Spanish translations; services copy rewrite (separate pending request); any layout/content change; Central's site.

## Process (Impeccable)

PRODUCT.md written 2026-08-05. Direction contract comment goes in root layout. Craft-floor loaded; eyebrow-ban overridden by pinned layout-parity constraint. Mechanical detector on changed targets; contrast-audit re-pointed at new palette; finish-reviewer subagent on screenshots (desktop+mobile, ≤2 fix rounds); documenter writes DESIGN.md from built result. Ship path: branch → Vercel preview for Clint → merge on approval.

## Success criteria

- Side-by-side with Central: obviously related structure, obviously different brand.
- All 207+ tests green; contrast audit green with new pairs; production build green.
- No layout reflow: section order and content identical before/after.
