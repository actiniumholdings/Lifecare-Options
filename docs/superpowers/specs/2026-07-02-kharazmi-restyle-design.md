# Lifecare Site — Kharazmi Restyle, Logo-Blue Palette (Design)

**Date:** 2026-07-02
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Ready for implementation planning
**Layout/component reference:** Dribbble — "Kharazmi Home Healthcare Web Platform UI Design" by Rojin Sadeghi Nejad (`https://dribbble.com/shots/26387597`): friendly sans, rounded soft-shadowed cards, amber icon tiles on service cards, floating-badge photo hero, warm caregiver photography, generous whitespace.
**Palette:** the **Lifecare logo's blue** (navy + care-blue) — NOT Kharazmi's green. We take Kharazmi's *structure and component language* and dress it in the brand blue.

---

## 1. Context

The full English Lifecare Options site (Plans 1–3) is built and launch-ready on `feat/full-site`. The user wants to **re-skin the whole site to the Kharazmi look** — its calm, trustworthy home-healthcare component style (rounded cards, amber icon tiles, photo-forward hero with floating badges, friendly sans) — but colored in the **brand's own blue** (the logo's navy + care-blue), with a warm **amber** secondary accent, rather than Kharazmi's green.

This is a **visual restyle only** — it keeps every page, all content/copy, routing, i18n (EN/ES), SEO, and the working lead form. The site is token-driven (`app/globals.css` `@theme`) with a shared primitive library (`components/ui/*`), so the reskin lands centrally: change tokens + fonts + primitives, and the pages inherit it.

**Supersedes** design decision #3 (design identity) and the primary-CTA color decision of `2026-07-01-full-marketing-site-design.md` — the Playfair serif + the old flat component look are replaced by the Kharazmi component language in brand blue. All other decisions in that spec (scope, single service line, i18n, SEO) stand.

## 2. Decisions locked (brainstorming, 2026-07-02)

| # | Decision | Choice |
|---|---|---|
| 1 | Depth | **Tokens + components reskin** — retoken + restyle the shared primitives; keep all pages/content/routes/i18n/SEO |
| 2 | Palette | **Logo blue** — navy `#0F2B47` + care-blue `#5A8BB8` family (NOT Kharazmi green), with **amber** as the warm secondary accent |
| 3 | Imagery | **Adopt AI-generated photography** (via Fal) — warm caregiver + senior imagery; **AI/stock only, never real patients** (covered entity) |
| 4 | Typography | **Full sans-serif** — Plus Jakarta Sans (headings) + Inter (body); drop Playfair |

## 3. Palette (token remap)

Replace the `@theme` palette in `app/globals.css`. The logo blues drive the identity; amber is the warm accent that gives the Kharazmi icon-tile/badge character.

| Token | Hex | Role |
|---|---|---|
| `--color-navy` | `#0F2B47` | dark sections, footer, primary heading text on light (logo navy) |
| `--color-navy-deep` | `#0A1F35` | deepest navy (darkest surfaces / body text on light) |
| `--color-care-blue` | `#5A8BB8` | brand blue — decorative fills, badges, accents (logo care-blue) |
| `--color-blue-deep` | `#2F5F8A` | **primary button bg + text-links/eyebrows/icons on light** (AA-safe deeper blue) |
| `--color-sky-soft` | `#DCE7F1` | soft blue section backgrounds (Kharazmi's "sage" role, in blue) |
| `--color-mist` | `#F2F7FB` | page background (blue-tinted) |
| `--color-amber` | `#E5A94E` | secondary accent — icon tiles, badges, secondary CTA fills |
| `--color-amber-deep` | `#C98A2E` | amber hover / amber text where needed |
| `--color-surface` | `#FFFFFF` | cards |
| `--color-surface-warm` | `#F7F6F2` | warm alt surface |
| `--color-slate` | `#5A6B7E` | secondary body text |
| `--color-success` | `#2D6A4F` | (unchanged) |
| `--color-alert` | `#C0392B` | form errors (unchanged) |
| `--color-border` | `#E1E8F0` | borders/dividers (blue-tinted) |

**Contrast discipline (WCAG AA — apply from the start; do not repeat the care-blue miss):**
- **Amber is a FILL/tile/badge color only** — always with dark navy text on it (never small amber text on white; amber on white fails).
- **Care-blue `#5A8BB8` is for decorative FILLS/badges**, NOT text on white (≈3.99:1, fails). For **text links, eyebrows, and icons on light**, use `--color-blue-deep` / `--color-navy` — verify ≥ 4.5:1.
- **Primary button** = `blue-deep` (or darker) bg + white text — the implementer computes the exact ratio and picks the lightest blue ≥ 4.5:1 (same method as the prior care-blue-deep fix; `#2F5F8A` is the starting candidate — adjust if it doesn't clear 4.5:1).
- Body/heading text = `navy-deep` on light; `mist`/white on dark navy.

## 4. Typography

- `lib/fonts.ts`: replace `Playfair_Display` with **`Plus_Jakarta_Sans`** (weights 400/500/600/700; variable `--font-plus-jakarta`); keep **`Inter`** (body). Update `globals.css` `@theme`: `--font-display: var(--font-plus-jakarta), system-ui, sans-serif;` `--font-sans: var(--font-inter), system-ui, sans-serif;`. Update `app/[locale]/layout.tsx` font-variable wiring (`playfair` → `plusJakarta`).
- Headings use `font-display` (Plus Jakarta Sans, weight 600–700), body uses `font-sans` (Inter). No serif anywhere. Keep the existing responsive clamp sizes.

## 5. Component restyle (`components/ui/*` + a few others)

- **Button** (`components/Button.tsx`): primary = `bg-blue-deep text-white rounded-xl` (AA); secondary = `bg-amber text-navy-deep rounded-xl`; tertiary = `text-blue-deep` link. Rounded ~`0.75rem` (Kharazmi uses rounded, not pill). Remove the `care-blue-deep` primary token usage.
- **Card** (`components/ui/Card.tsx` + `components/Card.tsx`): `rounded-2xl`, soft shadow (`shadow-[0_10px_30px_-12px_rgba(15,43,71,0.15)]`), white on sky/mist; accent variants → care-blue / amber / none.
- **Section** (`components/ui/Section.tsx`): tones — `light` (mist), **`sky`** (new soft-blue panel, `bg-sky-soft`), `dark` (navy). Dark hairline accent → care-blue.
- **Service cards** (`components/ServicesList.tsx`): each service gets an **amber icon tile** (rounded-xl `bg-amber/15` square, amber-deep icon) + title + description + a blue "Learn more" affordance. The signature Kharazmi service-card look.
- **Hero** (`components/ui/Hero.tsx`): a **navy/care-blue rounded panel** containing the AI hero photo, overlaid headline + intro + two buttons (blue primary + amber secondary), **floating pill badges** (icon + label, e.g. "Serving Katy since 2008", "24/7 on-call") and an optional overlapping trust `Card`. Replaces the gradient-tile hero; falls back to a blue panel if a photo is absent.
- **Band** (`components/ui/Band.tsx`): sky or navy editorial band; may host a photo.
- **Eyebrow** (`components/ui/Eyebrow.tsx`): `text-blue-deep` (AA) uppercase tracked (not amber).
- **Stat** (`components/ui/Stat.tsx`): `text-navy` / `text-blue-deep` numerals.
- **CtaBand** (`components/ui/CtaBand.tsx`): navy band; primary blue button + secondary (mist outline, retinted).
- **Nav** (`components/Nav.tsx`): white, blue primary CTA, navy logo lockup; **Footer** (`components/Footer.tsx`): navy bg, mist text (retint existing).
- **AnnouncementBar**: navy/care-blue bar.
- Floating pill **Badge** styling where the hero needs badges (small reusable inline element; may live in `Hero.tsx`).

## 6. Imagery (AI-generated via Fal)

Generate a small reusable set (~6) of warm, natural-light home-healthcare images — **AI/stock only, no real patients, no PHI**:
1. **Home hero** — a friendly nurse/caregiver with a smiling senior in a sunlit living room (landscape, with room on one side for the blue panel/overlay).
2–6. Section/band images reused across pages: a caregiver arriving at a home; hands-on care (blood-pressure check); a nurse and senior talking warmly; a therapist helping with mobility; a coordinator on the phone (for contact/refer).

- Generate with the media-gen/Fal tooling (**controller-led** — generated and visually vetted by the controller, not a blind subagent step); save to `public/images/` (e.g. `hero-care.jpg`, `band-visit.jpg`, …); optimize; add descriptive `alt` text.
- Photography-forward heroes may need a per-page photo prop; wire the home hero first, then reuse across About / Service Area / Careers / Contact / RPM bands.
- **Do not** clobber the existing `public/images/hero-photo.jpg` WIP on `phase-0` (separate branch; the worktree is clean).

## 7. Scope

**In scope:** `globals.css` tokens, `lib/fonts.ts`, all `components/ui/*` + `components/Button.tsx` / `Card.tsx` / `ServicesList.tsx` / `Nav.tsx` / `Footer.tsx` / `AnnouncementBar.tsx` / `Hero`/`Band`/`CtaBand`, AI imagery generation + wiring, and updating any component with hardcoded old-palette classes (`care-blue-deep` primary, `cream`, `peach`, Playfair, flat non-rounded cards). Update tests that assert old color classes (e.g. `bg-care-blue-deep`).

**Out of scope:** page content/copy, routes, i18n messages, SEO metadata/JSON-LD/sitemap/robots (values unchanged), deployment.

**OG image:** re-skin `app/opengraph-image.tsx` to the blue palette + Plus Jakarta (small step in the plan).

> Note: the new palette reuses the token *names* `--color-navy` and `--color-care-blue` that already exist. The reskin CHANGES their supporting tokens (adds `blue-deep`, `sky-soft`, `amber`, drops `care-blue-deep`/`cream`) and the component *styles* (rounded, shadows, amber tiles, photo hero, sans). So a class like `bg-navy` keeps working; the transformation comes from the new accent tokens, the fonts, the component shapes, and the imagery.

## 8. Guardrails

- **WCAG AA** contrast on every text/background pair (§3 discipline). Re-verify the primary CTA and any care-blue/amber text.
- Keep the honest states, hedged coverage copy, single phone line — untouched (content unchanged).
- Reduced-motion + skip-link + focus-visible behaviors preserved (focus ring stays navy/blue).
- All routes keep building + returning 200 under `/en` + `/es`; en/es parity holds; tests stay green.

## 9. Open items

- [ ] Compute exact AA-passing hexes for the primary blue button (white text) and confirm `blue-deep` works as text-on-light; adjust if `#2F5F8A` doesn't clear 4.5:1.
- [ ] Generate the ~6 AI images (prompts per §6) and vet them warm/on-brand before wiring.
- [ ] Update tests asserting `bg-care-blue-deep` / other old classes.
- [ ] Re-skin the OG image to blue.
- [ ] After build: update the Obsidian "Lifecare Website" hub (design identity = Kharazmi component language in brand blue).
- [ ] (Confirm) amber warm accent vs the logo's cream — amber is the default; swap if the user prefers cream.
