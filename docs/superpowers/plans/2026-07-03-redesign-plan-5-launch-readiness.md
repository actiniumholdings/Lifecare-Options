# Two-Pillar Redesign — Plan 5: Compliance Sweep, Contrast Audit & Launch-Readiness

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Finish the redesign: sweep payer-name marketing copy per client direction, run a programmatic AA contrast audit across every page, verify SEO completeness for all routes, capture a full screenshot matrix, and confirm launch-readiness.

**Architecture:** The site (Plans 1–4) is content-complete on the two-pillar navy+blue system. This plan is verification + a targeted copy sweep. No new pages.

**Tech Stack:** Next.js 16, Tailwind v4, next-intl v4, vitest. Contrast audit via a headless-Chrome script driving the running dev server.

**Spec:** `docs/superpowers/specs/2026-07-02-two-pillar-redesign-design.md` §7 (copy), §9 (verification gates).
**Builds on:** Plans 1–4 (branch `feat/two-pillar-redesign`).

## Global Constraints

- Branch `feat/two-pillar-redesign` in `~/Documents/Claude/Projects/lifecare-full-site`. Never touch the phase-0 checkout.
- **Payer-name rule (client direction, decided 2026-07-03):**
  - KEEP: the **"Medicare-certified"** credential wherever it appears (certification/standards claims, About credentials, footer, skilled eyebrow, SEO descriptions) — it is a credential, not a payer list.
  - KEEP: the functional **`LeadForm` Insurance dropdown** (coverage-intake field) — do NOT change it.
  - REMOVE/soften: payer names used as **marketing coverage** claims — e.g. "covered by Medicare," "available through Texas Medicaid," "Medicare, Medicaid, or private pay." Replace with neutral coverage language ("we'll walk you through coverage," "we check your coverage") that names no program.
- **English-only:** copy changes land in `en.json` + mirrored `es.json` (parity). Founding year is 2012.
- Every task ends green: `npm run typecheck && npm run lint && npm test` pass. Suite is 201 at plan start.
- iCloud gotcha: `find .next -name '* 2.*' -delete` if tsc chokes.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Payer-name marketing compliance sweep

Remove payer names used as coverage/marketing while keeping the "Medicare-certified" credential and the functional intake dropdown.

**Files:**
- Modify: `messages/en.json` + `messages/es.json` — soften payer-as-coverage strings (e.g. `rpm.coverage.body`, any `home.how.step*` coverage step, and any other "covered by Medicare/Medicaid/private pay" marketing copy).
- Modify: `components/home/HowItWorks.tsx` if its hardcoded step copy names payers ("Medicare, Medicaid, or private pay" → "your coverage").
- Do NOT touch: `components/LeadForm.tsx` Insurance dropdown; any "Medicare-certified" credential string.
- Test: a new `tests/compliance-payer-copy.test.ts`.

- [ ] **Step 1: Inventory** — `grep`/script every rendered string containing `medicare|medicaid|private pay|insurance` across `messages/en.json` and the hardcoded home components. Classify each as CREDENTIAL ("Medicare-certified", "Medicare and CHAP standards", "federal Medicare standards") → KEEP, or COVERAGE/MARKETING → soften. List the soften-set.
- [ ] **Step 2: Write the guard test** `tests/compliance-payer-copy.test.ts`:
  - Load `messages/en.json`; for the marketing namespaces (all EXCEPT any key whose value is exactly a credential phrase), assert no value matches `/covered by medicare|through (texas )?medicaid|medicaid,|, medicaid|private pay|medicare advantage/i`.
  - Allow `/medicare-certified/i` and "Medicare and CHAP" / "federal Medicare standards" credential phrasings explicitly.
  - Assert the home `HowItWorks` component text (import + render, or read the source) contains no "Medicaid" / "private pay".
  Run → it should FAIL on the current coverage strings.
- [ ] **Step 3: Soften the copy** — rewrite the flagged strings to name no program (keep meaning: coverage is checked/discussed, "call us about coverage"). Update `HowItWorks.tsx` step. Keep en/es parity.
- [ ] **Step 4: Green** — guard test passes; `npm run typecheck && npm run lint && npm test` clean.
- [ ] **Step 5: Commit** `fix(compliance): soften payer-name marketing copy (keep Medicare-certified credential + intake dropdown)`.

---

### Task 2: Programmatic AA contrast audit

Spec §9: assert every text/background pair meets WCAG AA (≥4.5:1 normal, ≥3:1 large ≥24px/≥18.66px-bold) across all rendered routes.

**Files:**
- Create: `scripts/contrast-audit.mjs` (Node + headless Chrome; not shipped in the app bundle)
- Output: a report; fix any failures in the offending component

- [ ] **Step 1: Write `scripts/contrast-audit.mjs`** — with the dev server running, for each route (`/`, `/services`, `/services/skilled`, `/services/attendant`, `/service-area`, `/about`, `/careers`, `/refer`, `/contact`, `/remote-patient-monitoring`, `/accessibility`), load the page in headless Chrome, walk all text nodes, compute each element's effective foreground vs. its nearest opaque background, compute the WCAG contrast ratio, and flag pairs below threshold (accounting for font-size/weight for the large-text 3:1 rule). Print `ROUTE | selector | fg | bg | ratio | FAIL`.
- [ ] **Step 2: Run it** against the running dev server (`node scripts/contrast-audit.mjs`). Capture the full list of failures.
- [ ] **Step 3: Fix failures** — for each real failure, adjust the offending token/class in the component (darken text, change tone) to reach AA. Re-run until zero failures. (Decorative/aria-hidden elements may be excluded with justification.)
- [ ] **Step 4: Green** — audit reports zero failures; `npm test` still green.
- [ ] **Step 5: Commit** `test(a11y): add contrast audit script; fix any AA failures`.

---

### Task 3: SEO completeness verification

Confirm every route is fully wired for SEO (Plan 3 added the new routes; verify the whole set).

**Files:**
- Verify/patch: `app/sitemap.ts`, `app/robots.ts`, per-route `generateMetadata`, `components/seo/JsonLd.tsx` / `lib/seo.ts`, OG image
- Test: extend `tests/sitemap.test.ts` / `tests/pages-metadata.test.ts` / `tests/seo.test.ts` if gaps found

- [ ] **Step 1: Audit** — for all 11 routes confirm: unique `<title>` + meta description, canonical + en/es hreflang, presence in sitemap (both locales), and that the MedicalBusiness JSON-LD is valid and lists both service lines. Script or grep the rendered `<head>` per route.
- [ ] **Step 2: Patch gaps** — add any missing metadata/sitemap/hreflang. Keep descriptions honest and cliché-free; no payer-as-coverage (Medicare-certified credential is fine in SEO).
- [ ] **Step 3: Green** — SEO tests pass; `npm run build` succeeds (sitemap/robots/OG emit).
- [ ] **Step 4: Commit** `chore(seo): verify + complete metadata/sitemap/JSON-LD across all routes`.

---

### Task 4: Full screenshot matrix + visual review

- [ ] **Step 1: Capture** — with the dev server running, screenshot all 11 routes at desktop (1440) and mobile (390) widths into the scratchpad.
- [ ] **Step 2: Review** — check every shot for: display-scale headings, no invisible text (light-on-light / navy-on-navy), no amber, consistent navy+blue system, readable nav dropdown, working responsive layout (no horizontal overflow on mobile), real hero photos. Note any defect and fix in the component.
- [ ] **Step 3: Commit** any fixes; record the matrix result in the ledger.

---

### Task 5: Launch-readiness + final gate

- [ ] **Step 1: Credentials present** — confirm CCN `747061` and TX license `011908` render where expected (About credentials, JSON-LD identifier, footer). These remain flagged verify-before-launch (real-world verification is the user's, not a code task).
- [ ] **Step 2: Final full gate** — `npm run typecheck && npm run lint && npm test && npm run build` all green.
- [ ] **Step 3: Compliance re-grep** — no payer-as-coverage marketing strings; no "2008"; no amber/mist; en/es parity across all namespaces.
- [ ] **Step 4: Commit** the gate (empty commit) and write a launch-readiness summary to the ledger.

---

## Out of scope / deferred

- **Spanish translation** — `es.json` mirrors English; a real ES pass is a separate future project.
- **Deployment / DNS** — mylifecareoptions.com Vercel deploy + domain is a separate task (no live deploy today).
- **Real-world credential verification** — confirming CCN/license validity with the agency is the user's, outside code.
- The `LeadForm` Insurance dropdown stays (client decision: functional intake field).
