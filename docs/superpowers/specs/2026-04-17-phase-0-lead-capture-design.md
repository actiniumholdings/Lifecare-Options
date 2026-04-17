# Lifecare Options — Phase 0: Single-Page Lead-Capture Site

**Date:** 2026-04-17
**Owner:** Clint Ives (Director of Operations, Actinium Healthcare Holdings)
**Status:** Ready for implementation planning
**Relationship to the full-site spec:** This is an MVP that ships first. The full marketing site spec (`2026-04-17-lifecare-website-design.md`) remains the long-term target and becomes Phase 1+ after this launches.

---

## 1. Context

Lifecare Options (LCO) needs a credible online presence *now*. The full premium marketing site (16 routes, illustrations, MDX content, maps) is a ~4-week project; this Phase 0 is the 1-week version that captures leads immediately and buys time for the full build. A single scrolling page with two lead-capture forms — one for services inquiries, one for employment — replaces the current Wix site and starts feeding qualified contacts to the intake team.

## 2. Goal

Ship a live, deployed single-page website at `mylifecareoptions.com` that:
- Looks credible and on-brand (reuses the full-site design system — palette, typography, logo, components)
- Captures two distinct lead types via an in-page toggle form
- Delivers every submission to `intake@mylifecareoptions.com` with subject-line filtering
- Can be iterated on weekly without a full rebuild

**Success criteria (qualitative, v1):**
- Lead-capture forms submit cleanly and reliably to email
- No visible "under construction" or placeholder text in the live version
- Mobile-first responsive, accessible (WCAG 2.1 AA)
- Lighthouse Performance > 90 on mobile
- The site looks like a deliberate choice, not an unfinished skeleton

## 3. Audiences

Same as the full spec, in the same priority order:
1. Families / adult children researching home health
2. Referral sources (hospitals, physicians, case managers)
3. Patients being discharged
4. Recruits

The single form handles 1–3 via the "Services inquiry" tab and audience 4 via the "Employment" tab.

## 4. Scope

**In scope:**
- A single `/` route with the full page content
- Global Nav (logo + phone + "Request info" anchor scroll)
- Hero section
- Brief About / credibility band
- Services-at-a-glance (6 discipline names, no detail pages)
- Two-tab lead-capture form (Services inquiry / Employment inquiry)
- Contact info + footer
- Resend API integration for form-submission email delivery
- DNS cutover from Wix to Vercel

**Out of scope (explicit non-goals, deferred to Phase 1+):**
- Service sub-pages (`/services/skilled-nursing` etc.)
- About, Service Area, Insurance, For Providers, FAQ, Careers detail pages
- Watercolor illustrations (Phase 1 adds them)
- Service area map (Leaflet)
- Multi-step Request Care form
- Resume upload on employment form (text-based contact fields only; follow-up via email)
- Blog, patient portal, insurance verifier, scheduling
- Separate email addresses per form type (one address, prefixed subject lines)

## 5. Architecture

Same stack as the full-site spec:

- **Next.js 15** (App Router) on **Vercel Pro**
- **Tailwind CSS v4** with the design tokens defined in the full spec §6
- **shadcn/ui** for form primitives (Input, Select, Checkbox, Textarea, Tabs)
- **Zod** for form validation schema
- **react-hook-form** for form state + submission
- **Resend** for email delivery (free tier, 100/day — plenty for LCO volume)
- **No database** — every submission is an email, with the full payload in the email body
- **Vercel Analytics + Speed Insights** — free on Pro

### Folder layout

```
/app
  page.tsx                     The single-page site (all sections inline)
  layout.tsx                   Root layout (fonts, metadata, global wrappers)
  globals.css                  Tailwind + design tokens
  api/
    lead/route.ts              POST handler — validates + sends email via Resend

/components
  Logo.tsx                     Icon + wordmark (reused from full spec)
  Nav.tsx                      Sticky header (logo + phone + CTA anchor)
  Footer.tsx                   Contact info + hours + accreditation
  Button.tsx                   Variants: primary / secondary / tertiary
  LeadForm.tsx                 The tabbed form (client component)
  TrustBadge.tsx               Success-green pill (reused)

/lib
  fonts.ts                     next/font (Playfair + Inter)
  site-config.ts               Phone, address, hours, accreditation — single source
  lead-schema.ts               Zod schemas for both form types

/public/images
  logo-icon.png                Nano Banana output (supplied by user)

/tests
  lead-schema.test.ts          Zod schema validation tests
  api-lead.test.ts             Route handler contract test
  LeadForm.test.tsx            Tab toggle + submit happy path

Configuration:
  package.json, tsconfig.json, next.config.mjs, postcss.config.mjs,
  vitest.config.ts, eslint.config.mjs, .prettierrc, .gitignore, README.md
```

## 6. Page structure (single `/` route)

Top to bottom:

1. **Nav** (sticky) — logo, phone link, "Request info" button that smooth-scrolls to the form
2. **Hero** — eyebrow ("Home Health · Katy, TX"), H1 "Quality care, felt at home.", subhead, two CTAs ("Request info" scroll + Call phone link). No hero image in v0 (kept simple); Phase 1 adds the watercolor.
3. **Trust strip** — three stats on Mist background: Medicare-certified + CHAP-accredited · Serving Katy since 2008 · 24/7 on-call
4. **About band** — two-column: left, H2 "Serving Katy families since 2008" + one paragraph of credibility copy; right, a static credibility block with four TrustBadges
5. **Services-at-a-glance** — eyebrow + H2 "Six disciplines, one coordinated plan" + a 3×2 grid of 6 cards, each showing a service name + one-line description. No "Learn more" links — this page *is* the site
6. **Lead form** (anchor: `#contact`) — section heading "Get in touch", two tabs:
   - **Services inquiry** — user-facing label: "Services inquiry" (default, selected on load)
   - **Employment inquiry** — user-facing label: "Work with us"
   Form content changes based on active tab; submit button posts to `/api/lead`
7. **Footer** — navy, 3 columns (address+phone / Hours / Accreditation + copyright)

## 7. Forms

### Services inquiry

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | ✓ | Split first/last or single field? Single field, "Full name" |
| Phone | tel | ✓ | Formatted input, US only |
| Email | email | ✓ | |
| Who is the care for? | radio | ✓ | Myself / Family member / Patient I'm referring |
| Services of interest | checkbox group | — | Skilled Nursing, PT, OT, Speech, Medical Social Work, Home Health Aide, Not sure |
| Insurance | radio | — | Medicare, Medicaid, Private, Private pay, Not sure |
| Timeline | radio | — | ASAP, Within 2 weeks, Within a month, Just researching |
| Message | textarea | — | 500-char limit |

### Employment inquiry

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | ✓ | Full name |
| Phone | tel | ✓ | |
| Email | email | ✓ | |
| Position interested in | select | ✓ | RN, LVN, HHA, Caregiver, Other |
| Years of experience | select | ✓ | <1, 1–3, 3–5, 5–10, 10+ |
| Texas license / certification | text | — | Free text, e.g., "RN license #12345" |
| Message | textarea | — | 500-char limit |

### Submission flow

1. Client validates with Zod schema (`lib/lead-schema.ts`)
2. Client POSTs to `/api/lead` with `{ type: "services" | "employment", ...fields }`
3. Server re-validates with same Zod schema
4. Server calls Resend with subject-prefixed email:
   - Services: `[Services] New inquiry from <name>`
   - Employment: `[Employment] New inquiry from <name>`
5. Email body is plain-text structured dump of the payload (no fancy HTML — clarity over prettiness in v0)
6. On success, the form replaces itself with a thank-you state. For employment submissions, the thank-you message includes: "Please email your resume to `jobs@mylifecareoptions.com` — we'll be in touch within 2 business days."
7. On error, show inline error and let the user retry

### Anti-spam

- **Honeypot field** — hidden input named `website` that bots fill but humans don't. Server rejects any submission with this field non-empty. This catches 95%+ of automated spam.
- **No rate limiting in v0** — Vercel serverless functions don't share in-memory state reliably, and Upstash/Redis adds infra complexity not worth it yet. Revisit in Phase 1 if spam gets through.
- **No CAPTCHA in v0** — adds friction; honeypot is sufficient for expected volume.

## 8. Visual design

Inherits everything from the full-site design spec (`2026-04-17-lifecare-website-design.md` §6):

- Palette (navy, care blue, peach cream, mist, white, slate, success green, alert red, borderline)
- Typography (Playfair Display for headlines, Inter for body/UI)
- Component vocabulary (Button variants, Card variants, TrustBadge, StatTile)
- Logo (icon + wordmark lockup)
- Spacing rhythm (4px grid, 96/56px section padding)

No illustrations in Phase 0 — Phase 1 adds them. Hero uses a simple gradient placeholder (`from-borderline to-peach-cream`) so the page doesn't feel empty but also doesn't look incomplete.

## 9. Content

All copy is final on launch — no placeholder text visible to visitors.

**Hero H1:** "Quality care, felt at home."
**Hero subhead:** "Medicare-certified skilled nursing, therapy, and personal care — delivered across Katy, Fort Bend, and Harris counties since 2008."

**About paragraph (approx 60 words):** "Lifecare Options has served Katy families since 2008. We're a CHAP-accredited, Medicare-certified home health agency, locally owned and small enough to know your name. Our clinicians bring skilled care into the home — where healing is most natural — and we're on-call 24/7 for whatever comes next."

**Services grid (6 cards, one-liner each):** Drafted by Claude, reviewed by Clint before launch. Each is one short sentence per discipline.

**Form section heading:** "Get in touch"
**Services tab label:** "Services inquiry"
**Employment tab label:** "Work with us"
**Services submit button:** "Request info →"
**Employment submit button:** "Submit inquiry →"

**Thank-you (services):** "Thanks — we got it. Our intake team will reach out within 1 business day."
**Thank-you (employment):** "Thanks for your interest. Please email your resume to `jobs@mylifecareoptions.com` — we'll be in touch within 2 business days."

## 10. Delivery plan

**Timeline: 5 working days.**

| Day | Deliverable |
|---|---|
| 1 | Next.js init, design tokens, Nav + Footer, Logo, Button component |
| 2 | Hero, Trust strip, About band, Services-at-a-glance — static sections done |
| 3 | LeadForm component (tabs, fields, validation, react-hook-form) |
| 4 | `/api/lead` route handler, Resend wiring, submission-to-email test, honeypot + rate limit |
| 5 | QA pass (mobile, a11y, Lighthouse), Vercel deploy, DNS cutover from Wix |

## 11. TBD / resolved before launch

- [ ] Medicare CCN — display in footer small-print
- [ ] Texas state license number — same
- [ ] Verify `intake@mylifecareoptions.com` mailbox exists and is monitored
- [ ] Verify `jobs@mylifecareoptions.com` mailbox exists (or plan to create)
- [ ] Resend domain verification for `mylifecareoptions.com` (DNS records)
- [ ] Wix DNS access — Clint confirms he can update DNS records when we cut over

## 12. Principles

- **Ship it.** Every "nice to have" is Phase 1's problem. This page captures leads and sets the tone, nothing more.
- **One source of truth for content.** `lib/site-config.ts` holds phone, address, hours. Change in one place, everywhere updates.
- **Real content, not placeholders.** The live site never shows "lorem ipsum" or "[TBD]" — if a fact is missing, we omit the claim or delay launch.
- **Accessibility is not optional.** Labels on every input, correct semantic HTML, keyboard-operable tabs, visible focus rings, WCAG 2.1 AA contrast.
- **No dark patterns.** No fake urgency, no forced signups, no "we respect your privacy (but check this box)." Just a clean form and a phone number.
