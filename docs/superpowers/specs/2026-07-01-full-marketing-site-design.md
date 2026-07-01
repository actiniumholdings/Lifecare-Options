# Lifecare Options — Full Marketing Site (Spec 1: English)

**Date:** 2026-07-01
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Ready for implementation planning
**Design source of truth:** `claude.ai/design` project "Design templates request" → `Design Templates.dc.html`

---

## 1. Context & relationship to prior work

Lifecare Options (LCO) is a Medicare-certified skilled home-health agency under Actinium Healthcare Holdings, based in Katy, TX and serving the Katy / Fort Bend / Harris area since 2008. Today the repo ships a **phase-0 single-page lead-capture MVP** (hero, trust strip, about band, 6-service grid, tabbed lead form, footer) with a working `LeadForm → /api/lead → Resend` pipeline.

This spec defines the **full marketing site** — a multi-page site at parity with the sister company **Central Home Health** (`central-home-health` repo), rendered in Lifecare's own design identity.

**Relationship to existing specs in this repo:**

- **Supersedes** `2026-04-17-lifecare-website-design.md` (the original, never-fully-implemented full-site spec) on three points: (a) **site structure** — we mirror Central's page set, not the original's 16-route layout; (b) **internationalization** — the site is now **bilingual (EN + ES)**, reversing the original's English-only non-goal; (c) **stack** — we follow the *actual* phase-0 + Central patterns (custom components, `motion/react`, custom SVG map), not the original's planned shadcn/ui + Leaflet + MDX (which were never built).
- **Preserves** from the original spec: the design system (palette, Playfair + Inter typography, logo), the confirmed business factuals, and the guardrails (§12).
- **Builds on** phase-0: reuses `LeadForm`, `/api/lead`, `send-lead-email`, `site-config`, `lib/motion`, `Logo`, and the motion components.

**"Parity with Central" means the same information architecture and section rhythm — NOT the same look.** Central is photography-forward (Fraunces + gold + ivory, PhotoHero/PhotoBand). Lifecare uses its own template identity (Playfair + care-blue + mist) with **illustration/gradient** heroes and bands — no photography dependency.

## 2. Decisions locked (from brainstorming, 2026-07-01)

| # | Decision | Choice |
|---|---|---|
| 1 | Scope | **Full parity with Central** — all 9 pages + full SEO (destination) |
| 2 | Languages | **EN + ES**, true parity, via `next-intl` v4 `[locale]` routing |
| 3 | Design identity | **The imported template** (Playfair Display + Inter, mist `#F7FAFC` base, care-blue accent) — retrofit phase-0 to match |
| 4 | Service model | **Single skilled-home-health line**, 7 services, one phone number (matches LCO's NPI/licensure) |
| 5 | Sequencing | **English-complete first (this spec = Spec 1)**, then a Spanish content pass (Spec 2) |

## 3. Goals & non-goals

**Primary job-to-be-done:** Help families researching home health for an aging parent build trust with LCO and call or submit a request; secondarily, capture referrals from providers and applications from caregivers.

**Audience priority:** (1) families / adult children, (2) referral sources (case managers, physicians, SNFs), (3) discharged patients, (4) recruits (RN / LVN / HHA / caregiver).

**Success criteria (v1, qualitative):**
- Reads as a premium modern healthcare brand consistent with the template.
- Every page has a clear primary CTA (Request info / Call / Refer / Apply).
- Mobile-first, fast (Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1), WCAG 2.1 AA.
- Content is specific and credible, not generic home-health boilerplate, and **not a copy-paste of Central** (see §11).
- English site fully functional with i18n scaffolding in place so Spanish (Spec 2) is a content-add, not a refactor.

**Non-goals (Spec 1):**
- Spanish copy authoring (that is Spec 2 — but all EN strings are externalized to make it a content-only pass).
- Patient portal / login, online eligibility check, blog, live chat, booking tool, custom CMS.
- Photography sourcing / photo shoot (illustration + gradient only for v1).
- Service *sub-pages* per discipline, a standalone `/insurance` page, `/faq`, and a multi-step `/request-care` wizard (all folded into Central's structure — see §7 note).

## 4. Architecture

**Stack (actual, inherited from phase-0 + mirrored from Central):**
- **Next.js 16** (App Router), React 19 — read `node_modules/next/dist/docs/` before writing code per `AGENTS.md` (this Next.js has breaking changes vs. training data).
- **Tailwind CSS v4** with `@theme` design tokens in `app/globals.css`.
- **`next-intl` v4** for i18n (`[locale]` segment), mirroring Central's `i18n/routing.ts` + `i18n/request.ts`.
- **`motion`** (`motion/react`) for animation — the rebranded Framer Motion package (already in phase-0).
- **Resend** for form delivery (existing `/api/lead` + `lib/send-lead-email.ts`).
- **Custom SVG** service-area map (mirror Central's `components/area/ServiceMap.tsx`), **not** Leaflet.
- **`next/font`** for Playfair Display + Inter.
- Content in typed TS modules under `lib/` + externalized UI strings in `messages/en.json` (no MDX, no CMS).

**Route migration:** move the existing single page into the `[locale]` segment.

```
app/
  [locale]/
    layout.tsx                          NextIntlClientProvider + <Header/> + <Footer/>
    page.tsx                            Home  (rebuilt from phase-0 page.tsx)
    services/page.tsx
    about/page.tsx
    service-area/page.tsx
    careers/page.tsx
    refer/page.tsx
    contact/page.tsx
    remote-patient-monitoring/page.tsx
    accessibility/page.tsx
  api/lead/route.ts                     (unchanged — stays OUTSIDE [locale])
  sitemap.ts  robots.ts  opengraph-image.tsx  icon.tsx  apple-icon.tsx
  layout.tsx                            root <html> shell
i18n/
  routing.ts                            locales ["en","es"], defaultLocale "en", localePrefix "as-needed"
  request.ts                            getRequestConfig → messages/{locale}.json
messages/
  en.json                               all UI copy, keyed by page/section (authored in Spec 1)
  es.json                               created empty/stub in Spec 1; authored in Spec 2
```

`localePrefix: "as-needed"` → English at `/`, Spanish at `/es/…` (matches Central).

**No database.** Leads and applications are emails via Resend, as in phase-0.

## 5. Design system (retrofit phase-0 → template identity)

The phase-0 code drifted to Spectral + Albert Sans on a cream base (`2026-05-16-phase-0-design-upgrade.md`). This spec **reverts to the template / original-spec identity**. The retrofit touches `lib/fonts.ts` and the `@theme` block in `app/globals.css`, and cascades to the existing home page.

**Fonts** (`lib/fonts.ts`, `next/font/google`):
- Display → **Playfair Display** (weights 400/500/600; italic 400) → `--font-display`
- Body/UI → **Inter** (weights 400/500/600/700) → `--font-sans`

**Tokens** (`@theme` in `globals.css`):

| Token | Value | Role |
|---|---|---|
| `--color-navy` | `#0F2B47` | headlines, text, dark sections, footer |
| `--color-care-blue` | `#5A8BB8` | **primary accent** — CTAs, eyebrows, links (Lifecare's equivalent of Central's gold) |
| `--color-cream` | `#FDEEDD` | peach-cream — warmth / featured cards |
| `--color-mist` | `#F7FAFC` | **base page background** + section backgrounds |
| `--color-white` | `#FFFFFF` | default surface / cards |
| `--color-slate` | `#6B7D92` | secondary body text |
| `--color-success` | `#2D6A4F` | certified/trust badges |
| `--color-alert` | `#C0392B` | form errors |
| `--color-border` | `#E4ECF3` | borders / dividers |

- Body background changes **cream → mist**; remove `cream-deep` / `cream-edge` / `footer-muted` drift tokens (or repurpose for footer text on navy).
- Type scale: H1 `clamp(2.5rem,6vw,4rem)`, H2 `clamp(2rem,4.5vw,3rem)`, H3 1.5rem; body 17px / 1.65; caption 13px. Eyebrows 12px, 600, `letter-spacing 0.16em`, uppercase, care-blue.
- Radius: card `0.5rem` (`--radius-card`), pill `9999px`. Section padding: 96px desktop / 56px mobile.

## 6. Component library (`components/ui/`, mirror Central, adapt to Lifecare)

Build a small, well-bounded primitive set (each independently understandable and testable):

- **Container** — centered column, max ~1200px, responsive gutters. Props: `as?`, `className?`.
- **Section** — full-width band with tone + optional header. Props: `tone` (`light`|`dark`), `eyebrow?`, `title?`, `intro?`, `centered?`, `id?`. Dark tone = navy bg, care-blue hairline top accent, cream/white text.
- **Button** — polymorphic (anchor if `href`). Variants: `primary` (filled care-blue pill), `outline` (navy outline pill), `text` (care-blue link). Sizes `md`|`lg`. (Reconcile with existing `components/Button.tsx`.)
- **Card** — white/mist surface, optional top accent rule. Props: `accent` (`peach`|`navy`|`none`).
- **Eyebrow** — care-blue uppercase tracked label.
- **Stat** — large Playfair numeral + Inter label. Props: `value`, `label`, `tone?`.
- **Hero** — gradient/illustration hero (NOT PhotoHero). Navy or mist background, the template's floating gradient tile motif (`linear-gradient(135deg,#E4ECF3,#FDEEDD)`), eyebrow, Playfair headline, intro, dual CTA. Evolve the existing `HeroIllustration`. **Do not clobber the user's uncommitted WIP** on `HeroIllustration.tsx` — reconcile with it.
- **Band** — quiet peach-cream editorial band (eyebrow + headline), the illustration/gradient stand-in for Central's PhotoBand.
- **Call button / bar** — single `tel:` action for `(281) 646-9546` (Lifecare has one line, so NO two-line `CallMenu`).
- **ServiceMap** — new client SVG for Lifecare's counties + `coverageCounties.ts` (mirror Central `components/area/`).

**Reused as-is (retokenized only):** `LeadForm` (tabs: *Services inquiry* / *Work with us*), `Logo`, `TrustBadge`, `TrustSentence`, `ServicesList`, and `components/motion/*` (`FadeUp`, `Stagger`, `StaggerWords`, `HoverLift`).

## 7. Pages — all 9 (Spec 1 builds these in English)

Each page ends with a navy Final-CTA band. Section headings below are *direction*, to be finalized as Lifecare-voiced copy during implementation (§11), then externalized to `messages/en.json`.

> **Structure note (reconciliation):** Central's page set folds several routes the original LCO spec listed separately — insurance detail → a section within `/services`; "request care" → the `/refer` + `/contact` lead forms; service sub-pages, `/faq`, standalone `/insurance` → deferred (optional future additions, not in this build).

**1. `/` Home** — mirrors Central's home composition:
Hero (eyebrow "Home Health · Katy, TX", H1 "Quality care, felt at home.", intro, CTAs Call + Request info) → **TrustBand** (stats: *Since 2008* · *Medicare-certified* · *CHAP-accredited* · *24/7 on-call*) → **Services grid** (7 cards, alternating peach/white/mist) → **How It Works** (3 steps: We listen → We coordinate → Care begins) → **Why Lifecare** (differentiators) → **peach editorial Band** → **Service-Area teaser** (copy + Katy-area city pills) → **Testimonials** (honest empty state — "Reviews coming soon", real quotes only) → **Careers teaser** → **Final CTA**.

**2. `/services`** — Hero → **Skilled Home Health pillar** detailing the 7 services (from `site-config.services`) with the one phone line → **Clinical specialties / conditions grid** (wound care, cardiac/CHF, COPD, diabetes management, post-surgical, stroke recovery, fall prevention, medication management, etc.) → **Insurance & coverage** (Medicare · Medicaid · Medicare Advantage · most private plans · private pay) → Final CTA.

**3. `/about`** — Hero → **Story & mission** (2-col: prose + mission card) → editorial Band → **Values / commitments** (incl. bilingual care) → **Credentials & accreditation** (CHAP-accredited, Medicare CCN, TX license, serving since 2008) → **Bilingual care** (EN/ES chips) → Final CTA.

**4. `/service-area`** — Hero → **Counties strip** (Harris, Fort Bend) → **Cities grid** (Katy, Cypress, Fulshear, Richmond, Rosenberg, Sugar Land, Missouri City, Brookshire, west Houston, + "and surrounding areas") → editorial Band → **ServiceMap** (animated SVG, counties color-coded, city pins; static under `prefers-reduced-motion`) + "Don't see your city? Call us" callout → Final CTA.

**5. `/careers`** — Hero ("Now hiring across the Katy area", roles: RN · LVN · HHA · Caregiver) → **Why work here** (culture cards) → **Open roles** (honest empty state if none) → **How to apply** — uses the existing **LeadForm "Work with us" tab → `jobs@mylifecareoptions.com`** (NO external ATS) → **Bilingual team welcome** → Final CTA.

**6. `/refer`** — Hero ("Refer a patient in minutes") → **Two ways to refer** (call intake `(281) 646-9546` / fax `(281) 646-9757` or referral form) → **Intake journey** (animated flow) → **Who can refer** (physicians, discharge planners, case managers, families) → **What happens next** (contact within 1 business day → verify coverage → plan of care → first visit → progress notes) → Final CTA. No PHI collected on-page.

**7. `/contact`** — Hero → **Contact details + map** (2-col: contact cards — phone, fax, email, hours; address card + Google Maps iframe for 434 Park Grove Dr, Katy, TX 77450) → **Contact / lead form** (reuse `LeadForm` services tab) → Final CTA.

**8. `/remote-patient-monitoring`** — Hero (with "New" badge) → **Advantages grid** (catch problems early · fewer ER trips · stay safely at home · care team watching · peace of mind · chronic-condition control) → **Who needs it** (chronic condition, post-hospital, aging in place, post-surgery) → **Coverage** → Final CTA.

**9. `/accessibility`** — Commitment (WCAG 2.1 AA) → What we've done (semantic structure, keyboard operability, contrast, reduced-motion, alt text) → Ongoing work → Contact us about access.

## 8. Internationalization architecture

- `i18n/routing.ts`: `locales: ["en","es"]`, `defaultLocale: "en"`, `localePrefix: "as-needed"`.
- `i18n/request.ts`: `getRequestConfig` loading `messages/{locale}.json`.
- Root `app/layout.tsx` = minimal `<html>`; `app/[locale]/layout.tsx` wraps `NextIntlClientProvider`, sets `<html lang>`, renders Header/Footer, calls `setRequestLocale`.
- **All UI copy externalized** to `messages/en.json`, keyed by page → section → field (e.g. `home.hero.headline`). Components consume via `useTranslations` (client) / `getTranslations` (server) exactly as Central does.
- `generateStaticParams` over locales; `hreflang` alternates emitted in metadata (both locales) so Spec 2 needs no routing changes.
- **Spec 1 deliverable:** complete `messages/en.json`; `messages/es.json` present as a stub (same key shape, values TODO). **Spec 2** authors the Spanish values + any locale-specific metadata.

## 9. SEO architecture (mirror Central)

- `lib/metadata.ts` — `SITE_URL = "https://www.mylifecareoptions.com"`, `SITE_NAME = "Lifecare Options"`, title template `"%s | Lifecare Options"`, default description, and `buildMetadata({ title, description?, path })` returning canonical + OpenGraph + Twitter card; per-locale `alternates.languages`.
- `app/sitemap.ts` — all 9 routes × both locales (home priority 1.0, others 0.8).
- `app/robots.ts` — allow all + sitemap URL.
- `app/opengraph-image.tsx` — Lifecare-branded card: navy background, care-blue accent bar, logo mark, "Lifecare Options" in Playfair, "Home Health" subtitle. 1200×630.
- `components/seo/JsonLd.tsx` + `lib/seo.ts` — `MedicalBusiness` schema with real data: name, telephone `(281) 646-9546`, faxNumber `(281) 646-9757`, address (434 Park Grove Dr, Katy, TX 77450), areaServed (cities), openingHours (Mo–Th 08:00–17:00, Fr 08:00–16:00), logo/image, and (once verified) CCN / license.

## 10. Data model (extend `lib/site-config.ts`)

Keep the existing `siteConfig` and `services` (7 services). Add:

- `serviceArea`: counties `["Harris County","Fort Bend County"]` + cities list (§7.4). New `lib/coverage-counties.ts` for map colors (mirror Central).
- `specialties`: string[] for the `/services` conditions grid.
- `insurancePlans`: grouped plan families for the coverage section.
- Fill candidates (marked **verify before launch**): `medicareCcn: "747061"`, `stateLicense: "011908"` (recovered from CMS Care Compare + Texas HHS eligibility list; confirm against LCO records before go-live).
- `positions`: [] (empty → honest empty state on `/careers`).
- `testimonials`: [] (empty → honest empty state on home).

## 11. Content & voice

- **Adapt Central's IA and section intent; author Lifecare's own copy.** Do NOT copy-paste Central's text — sister sites with duplicate content risk SEO penalties, and the voice should be Lifecare's.
- **De-AI standard (house rule):** no formulaic/buzzword/hollow phrasing ("Built by X, for Y", "seamless", "empower", "at the heart of"), no em-dash-itis, no throat-clearing. Warm, clinician-led, plain, specific.
- Honest states: empty testimonials and empty open-roles render truthful placeholders, never fabricated reviews or jobs.
- No dark patterns; CTAs are honest requests for contact.

## 12. Accessibility & quality guardrails

- WCAG 2.1 AA: semantic landmarks, heading hierarchy, keyboard nav, visible focus (`:focus-visible` navy ring, already in globals), color contrast, `alt` text, `prefers-reduced-motion` honored by all motion + the ServiceMap. `SkipLink` in layout.
- Performance: `next/image` for any raster assets, `font-display: swap`, Core Web Vitals budget per §3.
- SEO basics not theater: real semantic HTML, per-page meta, sitemap, OG, JSON-LD. No keyword stuffing.

## 13. Testing

- Follow phase-0's Vitest setup. Unit tests for: `LeadForm` (both tabs, validation, honeypot — preserve existing), `buildMetadata`, `telHref`, i18n message-key presence (a test asserting `es.json` keys match `en.json` shape once authored), and a smoke render per page. Keep the existing 34 tests green (reconcile the modified `tests/smoke.test.tsx` WIP). `typecheck` + `lint` clean; production build green before done.

## 14. Scope boundary

- **Spec 1 (this doc):** token retrofit; i18n scaffold (EN authored, ES stub); component library; all 9 pages in English; SEO; ServiceMap; data-model extensions; tests.
- **Spec 2 (later):** author `messages/es.json`; locale-specific metadata/OG; QA of Spanish routes.
- **Deferred / optional (future):** service sub-pages, `/insurance`, `/faq`, photography swap, real testimonials, leadership bios, DNS cutover (tracked in phase-0 HANDOFF Task 19).

## 15. Open items / flags

- [ ] **Service area** — confirm final counties/cities (starting set: Harris + Fort Bend; cities in §7.4).
- [ ] **CCN `747061` / TX license `011908`** — verify against LCO records before launch (recovered from public data, not yet confirmed).
- [ ] **Branch strategy** — `phase-0` has uncommitted user WIP (`HeroIllustration.tsx`, `smoke.test.tsx`, `public/images/hero-photo.jpg`, `public/videos/`). Build on a **new branch** off a clean base; do not clobber user WIP. Confirm branch name at planning time.
- [ ] **Imagery** — illustration/gradient confirmed for v1; `hero-photo.jpg` WIP suggests a possible later photography swap (easy to add via the Hero/Band components).
- [ ] **Google Maps embed** — confirm the exact place/pin for 434 Park Grove Dr.
- [ ] **Insurance plans** — confirm the accepted-plan list for the `/services` coverage section.
