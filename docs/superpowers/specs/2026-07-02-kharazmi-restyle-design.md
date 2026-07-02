# Lifecare Site — Kharazmi Restyle (Design)

**Date:** 2026-07-02
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Ready for implementation planning
**Style reference:** Dribbble — "Kharazmi Home Healthcare Web Platform UI Design" by Rojin Sadeghi Nejad (`https://dribbble.com/shots/26387597`). Soft green + amber, friendly sans, rounded cards, warm caregiver photography.

---

## 1. Context

The full English Lifecare Options site (Plans 1–3) is built and launch-ready on `feat/full-site` in the earlier "imported template" identity (navy + care-blue + peach + Playfair). The user wants to **re-skin the whole site to the Kharazmi look**: a calm, trustworthy home-healthcare aesthetic built on a green palette, an amber accent, friendly sans-serif type, rounded soft-shadowed cards, and warm photography.

This is a **visual restyle only** — it keeps every page, all content/copy, routing, i18n (EN/ES), SEO, and the working lead form. The site is token-driven (`app/globals.css` `@theme`) with a shared primitive library (`components/ui/*`), so the reskin lands centrally: change tokens + fonts + primitives, and the pages inherit it.

**Supersedes** design decision #3 (design identity) and the primary-CTA color decision of `2026-07-01-full-marketing-site-design.md`. All other decisions in that spec (scope, single service line, i18n, SEO) stand.

## 2. Decisions locked (brainstorming, 2026-07-02)

| # | Decision | Choice |
|---|---|---|
| 1 | Depth | **Tokens + components reskin** — retoken + restyle the shared primitives; keep all pages/content/routes/i18n/SEO |
| 2 | Imagery | **Adopt AI-generated photography** (via Fal) — warm caregiver + senior imagery; **AI/stock only, never real patients** (covered entity) |
| 3 | Typography | **Full sans-serif** — Plus Jakarta Sans (headings) + Inter (body); drop Playfair |

## 3. Palette (token remap)

Replace the `@theme` palette in `app/globals.css`. Exact hexes:

| Token | Hex | Role |
|---|---|---|
| `--color-forest` | `#054632` | dark sections, footer, primary heading text on light |
| `--color-forest-deep` | `#04271D` | deepest green (body text on light, darkest surfaces) |
| `--color-emerald` | `#0E9E7E` | brand green — decorative fills, badges, accents |
| `--color-emerald-deep` | `#0B7D64` | **primary button bg + text-links/eyebrows on light** (AA-safe) |
| `--color-sage` | `#98B3B0` | muted sage accent |
| `--color-sage-soft` | `#DCE9E4` | soft sage section backgrounds |
| `--color-mint` | `#F2F7F5` | page background |
| `--color-amber` | `#E5A94E` | secondary accent — icon tiles, badges, secondary CTA fills |
| `--color-amber-deep` | `#C98A2E` | amber hover / amber text where needed |
| `--color-surface` | `#FFFFFF` | cards |
| `--color-surface-warm` | `#F7F6F2` | warm alt surface |
| `--color-warm-gray` | `#5A5749` | secondary body text |
| `--color-success` | `#2D6A4F` | (unchanged, fits theme) |
| `--color-alert` | `#C0392B` | form errors (unchanged) |
| `--color-border` | `#E4EAE7` | borders/dividers (green-tinted) |

**Contrast discipline (WCAG AA — apply from the start, do not repeat the care-blue miss):**
- **Amber is a FILL/tile/badge color only** — always with dark forest text on it (never small amber text on white; amber on white fails).
- **Emerald `#0E9E7E` is for decorative FILLS/badges**, not text on white (fails AA as text). For **text links, eyebrows, and icons on light**, use `--color-emerald-deep` / `--color-forest` — verify ≥ 4.5:1.
- **Primary button** = `emerald-deep` (or darker) bg + white text — the implementer computes the exact ratio and picks the lightest green ≥ 4.5:1 (same method as the prior care-blue-deep fix).
- Body/heading text = `forest-deep` on light; `mint`/white on dark green.

## 4. Typography

- `lib/fonts.ts`: replace `Playfair_Display` with **`Plus_Jakarta_Sans`** (weights 400/500/600/700; variable `--font-plus-jakarta`); keep **`Inter`** (body). Update `globals.css` `@theme`: `--font-display: var(--font-plus-jakarta), system-ui, sans-serif;` `--font-sans: var(--font-inter), system-ui, sans-serif;`. Update `app/[locale]/layout.tsx` font variable wiring (`playfair` → `plusJakarta`).
- Headings use `font-display` (Plus Jakarta Sans, semibold), body uses `font-sans` (Inter). No serif anywhere.
- Heading weight/scale: Kharazmi headings are bold sans — set h1–h3 to weight 600–700 (currently 500 for the serif); keep the existing responsive clamp sizes.

## 5. Component restyle (`components/ui/*` + a few others)

- **Button** (`components/Button.tsx`): primary = `bg-emerald-deep text-white rounded-xl` (AA); secondary = `bg-amber text-forest-deep rounded-xl`; tertiary = `text-emerald-deep` link. Rounded ~`0.75rem` (Kharazmi uses rounded, not pill). Remove the `care-blue-deep` token usage.
- **Card** (`components/ui/Card.tsx` + `components/Card.tsx`): `rounded-2xl`, soft shadow (`shadow-[0_10px_30px_-12px_rgba(5,70,50,0.15)]`), white on sage/mint; accent variants → emerald / amber / none.
- **Section** (`components/ui/Section.tsx`): tones — `light` (mint), **`sage`** (new soft-green panel), `dark` (forest). Dark hairline accent → emerald.
- **Service cards** (`components/ServicesList.tsx`): each service gets an **amber icon tile** (rounded-xl `bg-amber/15` square, amber-deep icon) + title + description; add a green "Learn more" affordance. This is the signature Kharazmi service-card look.
- **Hero** (`components/ui/Hero.tsx`): a **forest/emerald rounded panel** containing the AI hero photo, overlaid headline + intro + two buttons (emerald primary + amber secondary), **floating pill badges** (icon + label, e.g. "Serving Katy since 2008", "24/7 on-call") and an optional overlapping trust `Card`. Replaces the gradient-tile hero. Falls back gracefully if a photo is absent (green panel).
- **Band** (`components/ui/Band.tsx`): sage or forest editorial band; may host a photo.
- **Eyebrow** (`components/ui/Eyebrow.tsx`): `text-emerald-deep` (AA) uppercase tracked (not amber).
- **Stat** (`components/ui/Stat.tsx`): `text-forest` / `text-emerald-deep` numerals.
- **CtaBand** (`components/ui/CtaBand.tsx`): forest-green band; primary emerald button + secondary (mist outline stays, retinted).
- **Nav** (`components/Nav.tsx`): white, emerald primary CTA, forest logo lockup; **Footer** (`components/Footer.tsx`): forest-green bg, mint text (retint existing).
- **AnnouncementBar**: forest/emerald bar.
- Add pill **Badge** styling where the hero needs floating badges (small reusable inline element; may live in `Hero.tsx`).

## 6. Imagery (AI-generated via Fal)

Generate a small reusable set (~6) of warm, natural-light home-healthcare images — **AI/stock only, no real patients, no PHI**:
1. **Home hero** — a friendly nurse/caregiver with a smiling senior in a sunlit living room (landscape, room on one side for the green panel/overlay).
2–6. Section/band images reused across pages: a caregiver arriving at a home; hands-on care (blood-pressure check); a nurse and senior talking warmly; a therapist helping with mobility; a coordinator on the phone (for contact/refer).

- Generate with the media-gen/Fal tooling; save to `public/images/` (e.g. `hero-care.jpg`, `band-visit.jpg`, …); optimize; add descriptive `alt` text (keyed in messages or passed as props).
- Photography-forward heroes may need a per-page photo prop; wire the home hero first, then reuse across About / Service Area / Careers / Contact / RPM bands.
- **Do not** clobber the user's existing `public/images/hero-photo.jpg` WIP on `phase-0` (that's a separate branch; the worktree is clean).

## 7. Scope

**In scope:** `globals.css` tokens, `lib/fonts.ts`, all `components/ui/*` + `components/Button.tsx` / `Card.tsx` / `ServicesList.tsx` / `Nav.tsx` / `Footer.tsx` / `AnnouncementBar.tsx` / `Hero`/`Band`/`CtaBand`, AI imagery generation + wiring, and updating any component with hardcoded old-palette classes (`care-blue`, `care-blue-deep`, `navy`-as-brand, `cream`, `mist`, Playfair). Update tests that assert old color classes.

**Out of scope:** page content/copy, routes, i18n messages (except any color/font words — none expected), SEO metadata/JSON-LD/sitemap/robots (values unchanged; OG image should be re-skinned to green — include as a small step), deployment.

**OG image:** re-skin `app/opengraph-image.tsx` to the green palette + Plus Jakarta (small step in the plan).

## 8. Guardrails

- **WCAG AA** contrast on every text/background pair (§3 discipline). Re-verify the primary CTA and any emerald/amber text.
- Keep the honest states, hedged coverage copy, single phone line — untouched (content unchanged).
- De-AI: no copy changes needed; if any label is added (e.g. hero badges), follow the house voice.
- Reduced-motion + skip-link + focus-visible behaviors preserved (focus ring retinted to forest/emerald).
- All routes keep building + returning 200 under `/en` + `/es`; en/es parity holds; tests stay green.

## 9. Open items

- [ ] Compute exact AA-passing hexes for the primary green button (white text) and confirm emerald-deep works as text-on-light; adjust `emerald-deep` if needed.
- [ ] Generate the ~6 AI images (prompts per §6) and confirm they read warm/on-brand before wiring.
- [ ] Update tests asserting `bg-care-blue-deep` / other old classes.
- [ ] Re-skin the OG image to green.
- [ ] After build: update the Obsidian "Lifecare Website" hub (design identity changed to Kharazmi green).
