# Two-Pillar Redesign — Plan 3: Services Hub + Pillar Pages + Nav Dropdown

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn the single skilled-only `/services` page into a two-pillar structure — a short `/services` hub that routes into `/services/skilled` (the existing skilled detail) and the net-new `/services/attendant` (Provider Attendant Services) — and add a Services nav dropdown. This resolves the home pillar deep-links that currently 404.

**Architecture:** The current `/services` (`app/[locale]/services/ServicesContent.tsx`) is skilled-focused and i18n'd via `useTranslations` (keys in `messages/en.json`; `messages/es.json` mirrors English while ES is deferred). Plan 3: (a) move the skilled detail into a new `/services/skilled` route; (b) rebuild `/services` as a short two-pillar hub; (c) create `/services/attendant` with net-new PAS content; (d) add a Services dropdown to `Nav`. New pages follow the existing inner-page pattern: `page.tsx` server shell (`generateMetadata` + `buildMetadata`) + a `*Content.tsx` client body using `useTranslations`; all new copy added to BOTH `en.json` and `es.json` (es mirrors en in English).

**Tech Stack:** Next.js 16 (App Router) — read `node_modules/next/dist/docs/` before coding per `AGENTS.md`. Tailwind v4, `motion/react`, next-intl v4, vitest.

**Spec:** `docs/superpowers/specs/2026-07-02-two-pillar-redesign-design.md` §6 (Services hub, /services/skilled, /services/attendant) + §5 design system.
**Builds on:** Plans 1–2. Reusable primitives: `PillarCard`, `StepList`, `PayerList`, `Hero` (interior), `Section`, `Eyebrow`, `Button`, `Card`, `CtaBand`.

## Global Constraints

- Branch `feat/two-pillar-redesign` in `~/Documents/Claude/Projects/lifecare-full-site`. Never touch the phase-0 checkout.
- **PAS payer/claims discipline (spec §3, HARD):** attendant services claim ONLY Medicaid PHC/CAS/FC + STAR+PLUS + private pay. NEVER Medicare for attendant care. NO LTC-insurance/VA claims. NO outcome guarantees ("we help you navigate qualification", not "you will qualify"). No invented statistics.
- **English-only (user decision):** new copy goes in `en.json`; mirror the same English into `es.json` to preserve key parity (real translation deferred). Do NOT hand-write Spanish.
- New pages use the established inner-page shape: server `page.tsx` (`generateMetadata` via `buildMetadata` with `path` + `locale`) + client `*Content.tsx` (`useTranslations`). Match `app/[locale]/about/` as the reference implementation.
- Every task ends green: `npm run typecheck && npm run lint && npm test` pass. Suite is 159 at plan start.
- Copy rules (spec §7): no AI clichés, no unverifiable claims, honest hedging.
- iCloud gotcha: `find .next -name '* 2.*' -delete` if tsc chokes.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Nav — Services dropdown

Turn the flat "Services" nav item into a dropdown (Skilled Home Health / Attendant Services / Remote Patient Monitoring). All other items stay flat. Keep the phone chip + "Refer a Patient" CTA. Mobile menu expands the three as sub-items.

**Files:**
- Modify: `components/Nav.tsx`
- Add message keys: `nav.skilled`, `nav.attendant`, `nav.rpm` in `messages/en.json` + `messages/es.json`
- Test: `tests/Nav.test.tsx` (extend)

**Interfaces:**
- Produces: desktop `Services` opens a menu with links `/services/skilled`, `/services/attendant`, `/remote-patient-monitoring`; the top-level "Services" label still links to `/services`.

- [ ] **Step 1: Write failing tests** — assert (a) a "Skilled Home Health" link to `/services/skilled` and an "Attendant Services" link to `/services/attendant` exist in the nav; (b) the top-level Services link to `/services` still exists; (c) keyboard access: the dropdown trigger is a `<button>` with `aria-expanded`. Follow the current `renderNav()` helper.
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** the dropdown. Add a `children` submenu to the Services entry in the `links` model; render desktop as a hoverable/focusable disclosure (button with `aria-expanded` + a `<ul>` menu), mobile as indented sub-links. Accessibility: trigger is a real `<button>`, menu items are links, `Escape`/blur closes it, `prefers-reduced-motion` respected. Use `nav.skilled/attendant/rpm` keys.
- [ ] **Step 4: Run tests + typecheck + lint → green.**
- [ ] **Step 5: Commit** `feat(nav): Services dropdown (skilled / attendant / RPM)`.

---

### Task 2: Create `/services/skilled` from the existing skilled detail

Move the current skilled-focused `/services` content into a dedicated `/services/skilled` route (spec §6 /services/skilled): interior hero (clinical imagery) → seven discipline cards → Conditions We Support (readable, on navy via `PayerList` tone="dark" or chips) → insurance list → how-care-starts `StepList` → `CtaBand`.

**Files:**
- Create: `app/[locale]/services/skilled/page.tsx` (server shell), `app/[locale]/services/skilled/SkilledContent.tsx`
- Move/rework: the current `ServicesContent.tsx` skilled sections become `SkilledContent`
- Message keys: new `skilled.*` namespace in `en.json` + `es.json` (migrate the existing `services.*` skilled copy)
- Test: `tests/pages/skilled.test.tsx`

**Interfaces:**
- Consumes: `services` data (7 disciplines) from `lib/site-config`; `Hero`, `StepList`, `PayerList`/chips, `CtaBand`.

- [ ] **Step 1: Write failing test** — `/services/skilled` renders one `<h1>`, the 7 discipline names, a readable "Conditions We Support" section (assert a condition chip's text is present AND on a dark section it uses white-on-navy, not the old invisible treatment), and an insurance list including Medicare + Medicaid.
- [ ] **Step 2: Run → fail** (route doesn't exist).
- [ ] **Step 3: Implement** the server shell (`generateMetadata` path `/services/skilled`) + `SkilledContent` using `useTranslations("skilled")`. Port the skilled sections from the current `ServicesContent`. Rebuild "Conditions We Support" with `PayerList tone="dark"` (readable chips). Add `skilled.*` keys to en+es.
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(services): add /services/skilled pillar page`.

---

### Task 3: Rebuild `/services` as a two-pillar hub

Replace the skilled-only `/services` with a short router (spec §6 Services hub): hero → two expanded `PillarCard`s (link to skilled + attendant) → "not sure which you need?" plain-language explainer → `PayerList` (both lines' payers) → `CtaBand`.

**Files:**
- Rewrite: `app/[locale]/services/ServicesContent.tsx`
- Message keys: rework `services.*` to the hub copy in en+es
- Test: `tests/pages/services.test.tsx` (rework existing)

- [ ] **Step 1: Write failing test** — `/services` shows both pillar headings linking to `/services/skilled` and `/services/attendant`, an explainer strip ("recovering from something" → skilled; "help with everyday tasks" → attendant), and a payers strip. Attendant payer text must not contain "Medicare".
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** the hub using two `PillarCard`s (reuse the home pillar data shape), an explainer `Section`, and `PayerList`. Keep it short (router, not detail).
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(services): rebuild /services as two-pillar hub`.

---

### Task 4: Create `/services/attendant` (net-new PAS page)

Spec §6 /services/attendant: interior hero (daily-living imagery `attendant-daily.jpg`) → "what an attendant helps with" task grid → two-path eligibility explainer (Medicaid path: PHC/CAS/FC + STAR+PLUS, "we help you navigate qualification"; private-pay path: start right away, flexible hours) → what-to-expect (care plan, supervisory visits, consistent attendant) → attendant-careers cross-link band → `CtaBand`.

**Files:**
- Create: `app/[locale]/services/attendant/page.tsx`, `app/[locale]/services/attendant/AttendantContent.tsx`
- Message keys: new `attendant.*` namespace in en+es
- Test: `tests/pages/attendant.test.tsx`

**Interfaces:**
- Consumes: `Hero` (photoSrc `/images/attendant-daily.jpg`), `Section`, `StepList` (eligibility/what-to-expect), `PayerList`, `Band`/`CtaBand`.

- [ ] **Step 1: Write failing test** — `/services/attendant` renders one `<h1>`, a task grid including "Bathing", "Meal preparation", "Light housekeeping"; a two-path eligibility section naming Medicaid PHC/CAS/FC + STAR+PLUS AND private pay; a careers cross-link to `/careers`. **Compliance asserts:** the page text does NOT contain "Medicare", does NOT contain guarantee language (`/guarantee|will qualify|approved/i`).
- [ ] **Step 2: Run → fail** (route doesn't exist).
- [ ] **Step 3: Implement** server shell (`generateMetadata` path `/services/attendant`) + `AttendantContent` using `useTranslations("attendant")`. Task grid from `Card`s; eligibility as two `Section`/cards or a `StepList`; payers via `PayerList`; careers cross-link `Band`. All copy in en+es. Honor the compliance rules exactly.
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(services): add /services/attendant PAS page`.

---

### Task 5: SEO + sitemap + JSON-LD for the new routes

**Files:**
- Modify: `app/sitemap.ts` (add `/services/skilled`, `/services/attendant`), the JSON-LD `availableService` (include both lines), robots if needed
- Test: `tests/sitemap.test.ts` (extend), `tests/pages-metadata.test.ts` (extend)

- [ ] **Step 1: Write failing tests** — sitemap includes both new routes (en + es alternates); JSON-LD `availableService` lists both skilled and attendant services; both new pages expose `generateMetadata` with canonical + hreflang.
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** the sitemap additions + JSON-LD `availableService` entries (attendant service typed honestly, no Medicare). 
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(seo): sitemap + JSON-LD for skilled/attendant routes`.

---

### Task 6: Green gate + visual review

- [ ] **Step 1: Full gate** — `npm run typecheck && npm run lint && npm test && npm run build` all pass.
- [ ] **Step 2: Visual** — screenshot `/services`, `/services/skilled`, `/services/attendant` at 1440 + 390. Confirm: hub shows two pillars; skilled page conditions chips are readable (no navy-void); attendant page shows task grid + two-path eligibility + daily-living photo; nav Services dropdown opens with three items; home pillar deep-links now resolve (no 404).
- [ ] **Step 3: Commit** the gate (empty commit).

---

## Compliance checklist (verify at gate)

- [ ] Attendant pages/sections never say "Medicare"; never claim LTC/VA.
- [ ] No guarantee/outcome language on attendant eligibility ("help you navigate", not "you will qualify").
- [ ] Payer lines exactly: skilled = Medicare · Medicare Advantage · Medicaid · commercial · private; attendant = Medicaid (PHC · CAS · FC) · STAR+PLUS · private pay.
- [ ] en/es key parity for every new namespace (`skilled.*`, `attendant.*`, reworked `services.*`, `nav.*`).

## Follow-on

- **Plan 4** — remaining pages (about incl. the 2012 founding-year copy already corrected, careers two-audience, service-area, refer, contact, RPM, accessibility).
- **Plan 5** — final SEO sweep + contrast audit + screenshot matrix + copy pass.
- **Deferred** — Spanish translation pass across all `es.json` namespaces.
