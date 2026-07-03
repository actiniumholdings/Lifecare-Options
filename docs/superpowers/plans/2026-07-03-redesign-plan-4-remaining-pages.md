# Two-Pillar Redesign — Plan 4: Remaining Pages + Legacy Purge

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Bring the remaining pages in line with the two-pillar, top-tier site — a two-audience Careers page (clinicians + attendants), an About that covers both service lines, a Refer page with a community-referral path, plus a small legacy-style cleanup — then delete the last amber/mist tokens.

**Architecture:** The remaining pages (`about`, `careers`, `service-area`, `refer`, `contact`, `remote-patient-monitoring`, `accessibility`) already exist as server-shell + `*Content.tsx` (i18n via `useTranslations`) and largely sit on the current design system. The legacy surface is small: a shared `@/components/Card` import and one `bg-amber` badge in RPM. This plan does targeted CONTENT work (Careers two-audience, About both-lines, Refer community path), a minimal legacy retint, then removes the now-unused `amber`/`mist` design tokens.

**Tech Stack:** Next.js 16 (read `node_modules/next/dist/docs/` per `AGENTS.md`), Tailwind v4, next-intl v4, vitest.

**Spec:** `docs/superpowers/specs/2026-07-02-two-pillar-redesign-design.md` §6 (About, Careers, Refer, others).
**Builds on:** Plans 1–3 (branch `feat/two-pillar-redesign`).

## Global Constraints

- Branch `feat/two-pillar-redesign` in `~/Documents/Claude/Projects/lifecare-full-site`. Never touch the phase-0 checkout.
- **English-only:** new copy in `en.json`; mirror English into `es.json` for key parity (Spanish deferred). No hand-written Spanish.
- **NO payer/program names** on these pages either (consistent with the Services direction): no Medicare/Medicaid/STAR+PLUS/PHC/CAS/FC/private-pay/insurance lists. A "Medicare-certified" credential mention (About credentials / existing badges) is allowed as a certification, not a payer list. Where coverage would come up, a soft "call us" line only.
- **Founding year is 2012** (already corrected). Do not reintroduce 2008.
- Attendant framing stays honest: no guarantees, no invented statistics.
- Every task ends green: `npm run typecheck && npm run lint && npm test` pass. Suite is 187 at plan start.
- Copy rules (spec §7): no AI clichés, no unverifiable claims.
- iCloud gotcha: `find .next -name '* 2.*' -delete` if tsc chokes.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Careers — two hiring audiences (clinicians + attendants)

Spec §6 Careers: split into **Clinical roles** (RN/LVN, PT, OT, ST, MSW) and **Attendant roles** (the volume hire — steady hours, a no-experience path, weekly-pay cadence ONLY if truthful/verifiable) with in-page anchor navigation, a shared "why work here," and the existing application flow into the LeadForm jobs tab.

**Files:**
- Modify: `app/[locale]/careers/CareersContent.tsx`
- Message keys: extend `careers.*` (add attendant-roles section, anchor labels) in en+es
- Test: `tests/pages/careers.test.tsx`

- [ ] **Step 1: Write failing test** — Careers renders BOTH a clinical-roles section and an attendant-roles section (assert headings/anchors for each), the word "attendant" appears, an anchor nav links to both sections (`#clinical`, `#attendant` or similar), and the application CTA still targets the LeadForm jobs tab (`#apply`). Compliance: no payer program names.
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** the two-audience layout: read the current `CareersContent.tsx`; keep its shell/Hero/why-work-here/application; add an `#attendant` roles section mirroring the clinical one (honest copy: everyday-support roles, steady hours, training provided / no prior experience required — only claims that are safe and generic). Add a small anchor nav (two links) near the top. Keep the honest empty-roles handling if positions are empty. Add `careers.*` keys to en+es.
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(careers): two hiring audiences — clinical + attendant roles`.

---

### Task 2: About — cover both service lines

Spec §6 About: story updated to cover skilled recovery care AND long-term daily/attendant support; mission; commitments band (keep the bilingual-care commitment); credentials strip (CHAP, Medicare-certified, TX license 011908, CCN 747061). Founding year is 2012 (already fixed).

**Files:**
- Modify: `app/[locale]/about/AboutContent.tsx`
- Message keys: adjust `about.*` copy in en+es
- Test: `tests/pages/about.test.tsx` (extend)

- [ ] **Step 1: Write failing test** — About mentions attendant/daily support alongside skilled (assert the page text matches `/attendant|everyday|daily support/i` AND `/skilled|nursing|therapy/i`); still renders one `<h1>`; credentials strip present (CHAP, license 011908, CCN 747061). Confirm no "2008" and no payer list.
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** — read `AboutContent.tsx`; broaden the story/mission copy so both lines are represented (skilled clinical recovery + attendant everyday support), keeping it honest and non-cliché. Preserve credentials + commitments. Edit `about.*` keys (en+es).
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(about): cover both service lines (skilled + attendant support)`.

---

### Task 3: Refer — add a community-referral path

Spec §6 Refer: physician/discharge referrals for skilled, PLUS a community-referral line (attendant care is not physician-referral-gated — families, case managers, and community partners can refer). Keep the no-PHI form direction and hedged response time.

**Files:**
- Modify: `app/[locale]/refer/ReferContent.tsx`
- Message keys: extend `refer.*` in en+es
- Test: `tests/pages/refer.test.tsx` (extend)

- [ ] **Step 1: Write failing test** — Refer shows both a clinical/physician referral path and a community/family referral path (assert copy matching `/physician|discharge|hospital/i` AND `/family|community|case manager|anyone/i`); no PHI form; response-time copy stays hedged. No payer names.
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** — read `ReferContent.tsx`; add the community-referral path alongside the existing clinical one. Keep the existing referral mechanics + hedged SLA. Edit `refer.*` (en+es).
- [ ] **Step 4: Green.**
- [ ] **Step 5: Commit** `feat(refer): add community/family referral path alongside clinical`.

---

### Task 4: Legacy retint — RPM amber badge + Card audit

Small cleanup so nothing renders the retired amber/mist palette.

**Files:**
- Modify: `app/[locale]/remote-patient-monitoring/RpmContent.tsx` (the `bg-amber` badge)
- Audit: `app/[locale]/**/*Content.tsx` for any `@/components/Card` usage on an amber/legacy variant; retint to the current palette
- Test: extend the relevant page test(s) if behavior/text changes; otherwise a visual check suffices

- [ ] **Step 1: Find the legacy surface** — `grep -rnE "bg-amber|text-amber|bg-mist|border-mist" app/[locale]` and `grep -rn "components/Card" app/[locale]`. For each `Card` usage, check the `variant` prop; anything using an amber/peach/mist variant must move to a blue/navy/white variant.
- [ ] **Step 2: Retint** — RPM badge `bg-amber … text-navy-deep` → a blue/navy treatment consistent with the system (e.g. `bg-blue-deep text-white` or `bg-navy text-white`), keeping AA contrast. Fix any amber Card variants found. No copy changes.
- [ ] **Step 3: Verify** — `grep -rnE "bg-amber|text-amber|bg-mist" app/[locale] components` → only allowed remnants are the token definitions in `globals.css` (removed in Task 5) and any shared component NOT on these pages. Run `npm run typecheck && npm run lint && npm test`.
- [ ] **Step 4: Commit** `chore(rpm): retint amber badge to blue; purge legacy Card variants`.

---

### Task 5: Delete the retired amber + mist tokens

Plan 1 kept `--color-amber` and `--color-mist` temporarily for not-yet-rebuilt pages. Now remove them (and `--color-amber-deep` / any mist variants) so the retired palette can't be used again.

**Files:**
- Modify: `app/globals.css` (remove the amber/mist token declarations + their comments)
- Audit: whole repo

- [ ] **Step 1: Confirm zero consumers** — `grep -rnE "\bamber\b|\bmist\b|bg-amber|text-amber|bg-mist|border-mist|amber-deep" app components lib` (exclude `globals.css`). Expect NOTHING (Task 4 cleared the last page usages). If a shared component still uses them, retint it first.
- [ ] **Step 2: Remove the tokens** from `app/globals.css` (`--color-mist`, `--color-amber`, and any `--color-amber-deep`), plus their now-stale comments.
- [ ] **Step 3: Verify** — `npm run typecheck && npm run lint && npm test && npm run build` all green; `grep -rn "color-amber\|color-mist" app` returns nothing.
- [ ] **Step 4: Commit** `chore(ds): delete retired amber + mist tokens`.

---

### Task 6: Green gate + visual review

- [ ] **Step 1: Full gate** — `npm run typecheck && npm run lint && npm test && npm run build` all pass.
- [ ] **Step 2: Visual** — screenshot `/about`, `/careers`, `/refer`, `/remote-patient-monitoring`, `/service-area`, `/contact`, `/accessibility` at 1440 + 390. Confirm: Careers shows two role sections with working anchors; About reads for both lines; Refer shows both referral paths; NO amber anywhere; all pages consistent on the navy/Fraunces/Lifecare-blue system; headings render at display scale.
- [ ] **Step 3: Commit** the gate (empty commit).

---

## Compliance checklist (verify at gate)

- [ ] No payer/program names on any of these pages (grep the rendered namespaces); a "Medicare-certified" credential in About is the only allowed exception.
- [ ] No "2008" anywhere; founding year is 2012.
- [ ] No amber/mist tokens or classes remain (`grep` clean).
- [ ] en/es key parity for every touched namespace (`careers.*`, `about.*`, `refer.*`, …).
- [ ] Careers attendant copy makes no unverifiable pay/benefit promises.

## Follow-on

- **Plan 5** — final SEO sweep, programmatic AA contrast audit across all rendered pages, full screenshot matrix (all routes × desktop/mobile), copy pass, and launch-readiness (verify CCN/license).
- **Deferred** — Spanish translation pass across all `es.json` namespaces; deployment/DNS.
