# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Adult children and spouses arranging care** for a parent/partner in Katy, Fort Bend, and Harris counties — often mid-crisis (post-hospital discharge), phone-first, comparing 2–3 agencies.
- **Referring clinicians** (hospital discharge planners, physicians' offices) sending patients via the Refer flow; speed and credential clarity matter most.
- **Caregivers and clinicians seeking work** (RNs, therapists, attendants) via Careers.

## Product Purpose

Lifecare Options is a Medicare-certified, CHAP-accredited home health agency in Katy, TX (since 2012). The site's job is lead generation: phone calls first, form submissions second, referrals from clinicians third.

## Positioning

Two equal service pillars under one roof: **Skilled Home Health** (nursing, PT/OT/ST, MSW, aide, RPM — Medicare-certified) and **Provider Attendant Services** (daily-living support — Medicaid PHC/CAS/FC, STAR+PLUS, private pay). Locally owned, single phone line, since 2012.

## Operating Context

- Sister company of Central Home Health (centraloftexas.com) under Actinium Holdings. The two sites currently share one design system; the business goal is for them to read as **distinct brands** with the same layout/content skeleton.
- Covered entity: HIPAA-aware marketing; compliance guard test (`tests/compliance-payer-copy.test.ts`) rejects payer-name marketing claims. No LTC-insurance or VA claims for PAS.

## Capabilities and Constraints

- Next.js 16 + Tailwind v4 + next-intl (Spanish locale currently disabled — es.json untranslated), motion library, Vercel.
- Leads: form → /api/lead → Resend → lc@ + clint.ives@actiniumholdings.com. No public email addresses (intake@/jobs@ do not exist).
- Facts: (281) 646-9546 · fax (281) 646-9757 · 434 Park Grove Dr, Katy TX 77450 · founded 2012 · CCN 747061 · TX license 011908.
- WCAG AA enforced programmatically (`scripts/contrast-audit.mjs`).

## Brand Commitments

- Logo: blue house-with-heart icon + wordmark; Lifecare blue accent family stays (`#5A8BB8` / `#2F5F8A` / `#7AA6CF`).
- **Pinned direction (Clint, 2026-08-05): soft & warm; peach & cream palette around the Lifecare blue; Young Serif + Nunito Sans; pill CTAs, larger radii, soft shadows, gentle motion.** Layout and content stay identical to current site.
- Honest states: no invented testimonials, positions, or claims. Single phone line.

## Evidence on Hand

- Real: accreditations (Medicare, CHAP), license numbers, service lists, county coverage, photography set in `public/images/`.
- Absent (do not fabricate): testimonials, open positions, patient counts, outcome statistics.

## Product Principles

1. Phone-first conversion — the number is the primary CTA everywhere.
2. Credentials stated plainly beat marketing superlatives (compliance + trust).
3. Two pillars get equal visual weight; neither reads as an upsell.
4. Warmth is the brand: family-run feel, never institutional or clinical-cold.
5. Distinct from Central at a glance; identical in structure underneath.
