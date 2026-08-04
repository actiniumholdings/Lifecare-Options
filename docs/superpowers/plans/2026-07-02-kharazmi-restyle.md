# Lifecare Site — Kharazmi Restyle (Logo-Blue) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the whole Lifecare site to the Kharazmi component language (friendly sans, rounded soft-shadowed cards, amber icon tiles, photo-forward hero with floating badges) dressed in the brand's logo blue (navy + care-blue) with an amber warm accent — keeping all content, routes, i18n, SEO, and forms intact.

**Architecture:** The site is token-driven (`app/globals.css` `@theme`) with a shared primitive library. The reskin lands centrally: retoken (blue palette + amber + sans fonts + rounded/shadow tokens), restyle the primitives to Kharazmi shapes, add AI photography, then QA. Most pages transform automatically; per-page work is only the photo heroes.

**Tech Stack:** Next.js 16 (App Router, `[locale]`), Tailwind v4 `@theme`, `next/font` (Plus Jakarta Sans + Inter), `motion/react`, Vitest. Imagery via Fal (`mcp__fal`).

## Global Constraints

_Every task's requirements implicitly includes this section._

- **Worktree:** `~/Documents/Claude/Projects/lifecare-full-site` (branch `feat/full-site`, continues from `fd4219c`). **cd into it at the start of every shell command** (iCloud repo). Before `tsc`/`build`, delete iCloud conflict copies: `find . -path ./node_modules -prune -o \( -name "* [0-9].ts" -o -name "* [0-9].tsx" -o -name "* [0-9].css" -o -name "* [0-9].json" \) -print -delete`. If dev fails with a Turbopack "Failed to open database" error, `rm -rf .next` and retry.
- **Visual-only restyle:** do NOT change page copy, routes, i18n message *values*, or SEO metadata/JSON-LD/sitemap/robots values. Only styling (tokens, fonts, component classes/shapes), imagery, and the OG image's look change.
- **Palette (exact hexes, spec §3):** navy `#0F2B47`, navy-deep `#0A1F35`, care-blue `#5A8BB8`, blue-deep `#2F5F8A` (AA-safe for text/buttons), sky-soft `#DCE7F1`, mist `#F2F7FB` (page bg), amber `#E5A94E`, amber-deep `#C98A2E`, surface `#FFFFFF`, surface-warm `#F7F6F2`, slate `#5A6B7E`, success `#2D6A4F`, alert `#C0392B`, border `#E1E8F0`.
- **Contrast discipline (WCAG AA):** amber is a FILL/tile/badge color ONLY (dark navy text on it); care-blue `#5A8BB8` is a decorative FILL only (fails as text on white); **text-links, eyebrows, icons on light, and the primary button use `blue-deep`/`navy`** (verify ≥ 4.5:1). Body/heading text = `navy-deep` on light, `mist`/white on dark.
- **Type:** Plus Jakarta Sans (headings, weight 600–700) + Inter (body). No serif.
- **Kharazmi shapes:** rounded cards (`rounded-2xl`), soft shadows, rounded buttons (`rounded-xl`, not pill), amber icon tiles on service cards, photo-panel hero with floating pill badges.
- **Imagery:** AI/stock only, NEVER real patients (covered entity). No PHI.
- **Keep green out:** the palette is blue + amber; no Kharazmi green.
- **Green gate** before a task is done: `typecheck` + `lint` + `test` + `build`; en/es routes still 200; en/es parity holds.
- **Commits:** frequent TDD commits. Never push.

---

## File Structure

**Modify:** `app/globals.css` (`@theme` palette + base), `lib/fonts.ts` (Plus Jakarta + Inter), `app/[locale]/layout.tsx` (font vars), `components/Button.tsx`, `components/ui/Card.tsx` + `components/Card.tsx`, `components/ui/Section.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/Stat.tsx`, `components/ui/CtaBand.tsx`, `components/ui/Hero.tsx`, `components/ui/Band.tsx`, `components/ServicesList.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/AnnouncementBar.tsx`, `app/opengraph-image.tsx`, and tests asserting old classes.
**Create:** `public/images/*.jpg` (AI imagery), possibly `components/ui/Badge.tsx` (floating hero pill).

---

## Task 1: Palette tokens + fonts (the central retoken)

**Files:** Modify `app/globals.css`, `lib/fonts.ts`, `app/[locale]/layout.tsx`; Test `tests/fonts.test.ts` (update), `tests/theme.test.tsx` (new smoke).

**Interfaces:** Produces `plusJakarta`, `inter` from `lib/fonts.ts` (`.variable` = `--font-plus-jakarta` / `--font-inter`); new tokens `blue-deep`, `sky-soft`, `amber`, `amber-deep`, `surface`, `surface-warm`, `navy-deep` usable as Tailwind classes; `mist` re-valued to `#F2F7FB`. **Additive** — keep `care-blue-deep`/`cream` for now so nothing breaks mid-plan; Task 9 removes them once unreferenced.

- [ ] **Step 1: Confirm AA for the primary blue.** Run the WCAG calc for white on `#2F5F8A` and `#2F5F8A` on white:
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site && node -e 'const L=h=>{const c=h.replace("#","").match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const R=(a,b)=>{const x=L(a),y=L(b),h=Math.max(x,y),l=Math.min(x,y);return((h+.05)/(l+.05)).toFixed(2)};console.log("white/blue-deep",R("#ffffff","#2f5f8a"),"| blue-deep/white-text-on-light",R("#2f5f8a","#ffffff"),"| amber/navy",R("#e5a94e","#0f2b47"))'
```
Expected: white on `#2F5F8A` ≥ 4.5 and blue-deep on white ≥ 4.5 and amber/navy ≥ 4.5. If white-on-`#2F5F8A` < 4.5, darken `blue-deep` (e.g. `#2B577F`) until ≥ 4.5 and use that hex everywhere below.

- [ ] **Step 2: Replace the `@theme` + base in `app/globals.css`** (keep `care-blue-deep`/`cream` lines if present, appended, so old refs survive until Task 9):
```css
@import "tailwindcss";

@theme {
  /* Palette — Kharazmi structure, logo-blue identity */
  --color-navy: #0f2b47;
  --color-navy-deep: #0a1f35;
  --color-care-blue: #5a8bb8;
  --color-blue-deep: #2f5f8a; /* AA: white text on it, and it as text on white */
  --color-sky-soft: #dce7f1;
  --color-mist: #f2f7fb;
  --color-amber: #e5a94e;
  --color-amber-deep: #c98a2e;
  --color-surface: #ffffff;
  --color-surface-warm: #f7f6f2;
  --color-slate: #5a6b7e;
  --color-success: #2d6a4f;
  --color-alert: #c0392b;
  --color-border: #e1e8f0;
  /* legacy (removed in Task 9 once unreferenced): */
  --color-care-blue-deep: #6895be;
  --color-cream: #fdeedd;

  --font-display: var(--font-plus-jakarta), system-ui, sans-serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;

  --spacing-section-y-desktop: 6rem;
  --spacing-section-y-mobile: 3.5rem;
  --radius-card: 1rem;
  --radius-pill: 9999px;
}

html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; scroll-behavior: smooth; }
body { background: var(--color-mist); color: var(--color-navy-deep); font-family: var(--font-sans); font-size: 1.0625rem; line-height: 1.65; }
h1, h2, h3, h4 { font-family: var(--font-display); color: var(--color-navy); font-weight: 700; line-height: 1.1; }
h1 { font-size: clamp(2.5rem, 6vw, 4rem); }
h2 { font-size: clamp(2rem, 4.5vw, 3rem); }
h3 { font-size: 1.5rem; }
section[id] { scroll-margin-top: 5rem; }
:focus-visible { outline: 2px solid var(--color-blue-deep); outline-offset: 2px; border-radius: 4px; }
```

- [ ] **Step 3: Rewrite `lib/fonts.ts`**:
```ts
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
```

- [ ] **Step 4: Update `app/[locale]/layout.tsx`** — change the font import + the `<html className>` from `playfair`/`inter` to `plusJakarta`/`inter`:
```tsx
import { plusJakarta, inter } from "@/lib/fonts";
// ...
<html lang={locale} className={`${plusJakarta.variable} ${inter.variable} h-full antialiased`}>
```

- [ ] **Step 5: Update `tests/fonts.test.ts`** — assert `plusJakarta.variable === "--font-plus-jakarta"` and `inter.variable === "--font-inter"` (replace the old `playfair` assertion). Add `tests/theme.test.tsx`: render a `<div className="bg-blue-deep text-amber">` and assert the classes are present (a trivial smoke that the utility names exist).

- [ ] **Step 6: Run tests + typecheck + build**
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/fonts.test.ts tests/theme.test.tsx && npm run typecheck && npm run build 2>&1 | tail -3
```
Expected: pass; build green (Playfair no longer referenced; Plus Jakarta loads).

- [ ] **Step 7: Commit**
```bash
git add app/globals.css lib/fonts.ts "app/[locale]/layout.tsx" tests/fonts.test.ts tests/theme.test.tsx
git commit -m "feat: retoken to logo-blue palette + Plus Jakarta Sans"
```

---

## Task 2: Button — Kharazmi blue/amber

**Files:** Modify `components/Button.tsx`; Test `tests/Button.test.tsx`.

**Interfaces:** `Button` variants unchanged (`primary`/`secondary`/`tertiary`, `md`/`lg`, polymorphic). Primary now `bg-blue-deep text-white`, secondary `bg-amber text-navy-deep`, tertiary `text-blue-deep` link; `rounded-xl`.

- [ ] **Step 1: Update the failing test** — in `tests/Button.test.tsx`, change the primary-variant assertion from `/bg-care-blue-deep/` to `/bg-blue-deep/`. Run → FAIL (button still emits old class).
- [ ] **Step 2: Update `VARIANT_STYLES`** in `components/Button.tsx`:
```ts
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-blue-deep text-white hover:bg-navy rounded-xl",
  secondary: "bg-amber text-navy-deep hover:bg-amber-deep rounded-xl",
  tertiary: "bg-transparent text-blue-deep hover:text-navy underline-offset-4 hover:underline",
};
```
- [ ] **Step 3: Run test → PASS; full suite; typecheck.**
- [ ] **Step 4: Commit** (`feat: restyle Button to blue-deep primary + amber secondary`).

---

## Task 3: Card, Section (sky tone), Eyebrow, Stat, CtaBand

**Files:** Modify `components/ui/Card.tsx`, `components/Card.tsx`, `components/ui/Section.tsx`, `components/ui/Eyebrow.tsx`, `components/ui/Stat.tsx`, `components/ui/CtaBand.tsx`; Tests: update `tests/ui/section.test.tsx`, `tests/ui/eyebrow-stat.test.tsx`, `tests/ui/cta-band.test.tsx` where they assert colors.

- [ ] **Step 1: Read each file** to see current classes. Then apply:
  - **Card**: `rounded-2xl` + soft shadow `shadow-[0_10px_30px_-12px_rgba(15,43,71,0.15)]`; accent variants → `care-blue`/`amber`/none (replace any `cream`/`peach`).
  - **Section**: add a `sky` tone → `bg-sky-soft text-navy-deep`; keep `light` (`bg-mist`) and `dark` (`bg-navy text-mist`); dark hairline `bg-care-blue/40`.
  - **Eyebrow**: `text-blue-deep` (was care-blue) uppercase tracked.
  - **Stat**: value `font-display text-navy`; label `text-slate` (light) / `text-mist/70` (dark).
  - **CtaBand**: `Section tone="dark"` (navy); primary Button + secondary Button with `!border-mist !text-mist` override retained.
- [ ] **Step 2: Update the tests** that assert specific old classes (e.g. Section dark still `bg-navy` — unchanged; Eyebrow now `text-blue-deep`; add a `sky` tone assertion). Keep them real.
- [ ] **Step 3: Run the ui tests → PASS; full suite; typecheck.**
- [ ] **Step 4: Commit** (`feat: restyle Card/Section/Eyebrow/Stat/CtaBand to blue + rounded`).

---

## Task 4: ServicesList — amber icon tiles

**Files:** Modify `components/ServicesList.tsx`; Test `tests/` (add or update a ServicesList render test).

- [ ] **Step 1: Read `components/ServicesList.tsx`** (it renders the 7 `siteConfig.services` with `iconName`s). Restyle each service into a Kharazmi card: a white `rounded-2xl` card with soft shadow containing an **amber icon tile** (`<div className="grid h-12 w-12 place-items-center rounded-xl bg-amber/15 text-amber-deep">` wrapping the icon), the service name (`font-display text-navy`), the description (`text-slate`), and a `text-blue-deep` "Learn more" affordance. Keep the icon mapping intact.
- [ ] **Step 2: Test** — render `<ServicesList/>` (wrap in `NextIntlClientProvider` if it reads translations) and assert a service name renders and an element with the amber-tile class exists. Run → implement → PASS.
- [ ] **Step 3: Full suite + typecheck; Commit** (`feat: Kharazmi amber icon tiles on service cards`).

---

## Task 5: Nav, Footer, AnnouncementBar retint

**Files:** Modify `components/Nav.tsx`, `components/Footer.tsx`, `components/AnnouncementBar.tsx`; update any test asserting their colors.

- [ ] **Step 1: Read each.** Retint to the blue system: Nav white with a `bg-blue-deep text-white rounded-xl` primary CTA and navy logo lockup; Footer `bg-navy text-mist` (retint any `cream`/old refs to `mist`/`care-blue`); AnnouncementBar `bg-navy` or `bg-blue-deep` with mist text. Replace any `cream`/`care-blue-deep` classes.
- [ ] **Step 2: Run existing Nav/Footer tests → keep green (update color assertions if any). Full suite; typecheck.**
- [ ] **Step 3: Commit** (`feat: retint Nav/Footer/AnnouncementBar to blue`).

---

## Task 6: Hero photo-panel + floating badges + Band

**Files:** Modify `components/ui/Hero.tsx`, `components/ui/Band.tsx`; optionally create `components/ui/Badge.tsx`; Test `tests/ui/hero.test.tsx`.

**Interfaces:** `Hero` gains an optional `photoSrc?: string` + `photoAlt?: string` and `badges?: {icon?, label}[]`. When `photoSrc` is set, render the AI photo inside a navy/care-blue `rounded-2xl` panel with the headline/intro/CTAs overlaid (or beside on desktop) + floating pill badges; when absent, fall back to a blue gradient panel (so the component works before images land in Task 7). Keep the single `<h1>` and existing props (`eyebrow`, `headline`, `intro`, `primaryCta`, `secondaryCta`).

- [ ] **Step 1: Update the hero test** — keep the existing assertions (h1 renders headline, eyebrow shows, CTAs are links). Add: when `photoSrc` is passed, an `<img>` with that alt renders; badges render their labels. Run → FAIL.
- [ ] **Step 2: Implement** the photo-panel Hero (navy/care-blue panel, `next/image` or `<img>` for `photoSrc`, overlaid text, `rounded-2xl`, floating `Badge` pills using `bg-white/90 text-navy` or `bg-amber text-navy-deep`). Restyle `Band` to a `bg-sky-soft` or `bg-navy` editorial band (optionally accepting a `photoSrc`). Reduced-motion safe.
- [ ] **Step 3: Run hero test → PASS; full suite; typecheck; build.**
- [ ] **Step 4: Commit** (`feat: Kharazmi photo-panel Hero with floating badges + Band`).

---

## Task 7: AI imagery generation + wiring (CONTROLLER-LED)

> The controller generates + visually vets the images via Fal, then a subagent (or the controller) wires them. Do NOT have a blind subagent generate images unseen.

**Files:** Create `public/images/*.jpg`; Modify `app/[locale]/HomeContent.tsx` (pass `photoSrc` to Hero) and 3–5 page bodies (About/ServiceArea/Careers/Contact/RPM) to pass a band/hero photo; add `alt` strings.

- [ ] **Step 1 (controller): Generate ~6 images via Fal** (`mcp__fal` text-to-image, e.g. a Flux model). Prompts: warm, natural window light, real-photo style, a friendly nurse/caregiver with a smiling senior at home; a caregiver arriving at a front door with a bag; a nurse taking an older adult's blood pressure; a therapist helping a senior walk; an intake coordinator on the phone with a headset. Diverse, professional, no on-image text, landscape 3:2 for heroes. Vet each; regenerate any that look off/uncanny. Save to `public/images/` (`hero-care.jpg`, `visit.jpg`, `vitals.jpg`, `mobility.jpg`, `coordinator.jpg`, `home-band.jpg`) and optimize (≤ ~300 KB each).
- [ ] **Step 2: Wire the home hero** — in `HomeContent.tsx`, pass `photoSrc="/images/hero-care.jpg"` + an alt + badges to `<Hero>`.
- [ ] **Step 3: Wire bands/heroes** on About, Service Area, Careers, Contact, RPM to reuse the image set (a `photoSrc` on their Hero or Band). Keep alts descriptive.
- [ ] **Step 4: Verify** `next/image` config allows local images (it does); `npm run build` succeeds; images render (dev curl or screenshot). typecheck + full suite green.
- [ ] **Step 5: Commit** (`feat: add AI caregiver imagery + wire photo heroes/bands`).

---

## Task 8: Re-skin the OpenGraph image

**Files:** Modify `app/opengraph-image.tsx`.

- [ ] **Step 1: Update the colors + font** — navy `#0F2B47` background, care-blue/`blue-deep` accent bar, amber accent, "Lifecare Options" in Plus Jakarta (or the existing bundled-font fallback), "Home Health · Katy, TX" subtitle. Keep the build-safe font fallback.
- [ ] **Step 2: `npm run build`** succeeds and emits `/opengraph-image`. Commit (`feat: re-skin OG image to blue`).

---

## Task 9: Final gate + cleanup + QA

**Files:** Modify `app/globals.css` (remove orphaned tokens); verification.

- [ ] **Step 1: Remove orphaned legacy tokens.** Grep for any remaining use of the old tokens: `grep -rnE "care-blue-deep|bg-cream|text-cream|cream-|font-spectral|font-albert|playfair" app components`. Repoint any stragglers (cream→surface-warm/mist; care-blue-deep→blue-deep). Once the grep is clean, delete `--color-care-blue-deep` and `--color-cream` from `@theme`.
- [ ] **Step 2: iCloud conflict cleanup** (`find … -name "* [0-9].*" … -delete`).
- [ ] **Step 3: AA re-verify** — recompute contrast for the final primary button, eyebrow/link `blue-deep` on light, and amber tiles (dark text). All ≥ 4.5:1.
- [ ] **Step 4: Gate** — `npm run typecheck && npm run lint && npm run test && npm run build`, all green. Fix tests still asserting old classes.
- [ ] **Step 5: Route + parity smoke** — dev server; every route 200 under `/` + `/es`; en/es parity (`node` check) OK. Stop dev.
- [ ] **Step 6: Visual check** — screenshot or click home + one interior page; confirm blue/amber Kharazmi look, photo hero, rounded cards, sans type.
- [ ] **Step 7: Commit** (`chore: restyle gate — remove legacy tokens, AA + routes verified`).

---

## Definition of done

- Whole site reads as the Kharazmi component language in the logo blue: Plus Jakarta sans headings, rounded soft-shadowed cards, amber icon tiles on services, blue-deep primary buttons + amber secondary, sky-soft section panels, navy dark sections/footer, and a photo-panel hero with floating badges + AI caregiver imagery.
- WCAG AA holds (amber = fills only; blue-deep for text/buttons). No legacy tokens (`care-blue-deep`, `cream`) remain.
- Content/routes/i18n/SEO unchanged; `typecheck`+`lint`+`test`+`build` green; all routes 200 under `/en`+`/es`; en/es parity holds.

**Next:** update the Obsidian hub (identity = Kharazmi-in-blue); then the deferred launch items (Spec 2 Spanish, deployment Task 19) still stand.
