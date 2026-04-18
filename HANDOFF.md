# Lifecare Options Website — Session Handoff

**Date handed off:** 2026-04-18
**Project folder:** `/Users/clintives/Documents/Claude/Projects/Lifecare Website`
**GitHub repo:** https://github.com/clintusmc/Lifecare (branches `main` + `phase-0`)

---

## Where we are

✅ **Phase 0 code complete.** Single-page lead-capture website built, tested, pushed to GitHub.
❌ **Task 19 (deployment) NOT done yet.** User is picking it up in the next session.

## What's built

A Next.js 16 single-page website at `github.com/clintusmc/Lifecare` on the `phase-0` branch:

- Hero, trust strip, about band, 6-service grid, lead form, footer
- Two lead forms (Services inquiry + Work with us) toggled via tabs
- Form submissions → `/api/lead` → Resend email to `intake@mylifecareoptions.com`
- Honeypot spam protection, Zod 4 validation, React Hook Form
- 34 tests passing, typecheck + lint clean, production build green
- Tailwind v4 design tokens (navy / care-blue / peach-cream / mist)
- Playfair Display (headlines) + Inter (body) via next/font
- Logo: user-supplied PNG with full lockup, split into icon (`logo-square.png`) + code-rendered wordmark

## Key decisions made

- **Phase 0 vs full marketing site:** User chose to ship a simple lead-capture MVP first. The full 16-page marketing site is deferred to Phase 1+.
- **Stack:** Next.js 16, React 19, Tailwind v4, Zod 4, react-hook-form, Resend, Vercel Pro.
- **Logo:** User supplied a PNG lockup (`public/images/logo-icon.png`). I cropped the icon portion to `public/images/logo-square.png` (281×281) and the Logo component renders icon + wordmark separately so each is independently sized.
- **No database in v0.** Lead submissions are emails, not DB rows.
- **ESLint adaptation:** `eslint-config-next` breaks on ESLint 10 — config bypasses it and uses `@next/eslint-plugin-next` directly. Documented in `eslint.config.mjs`.
- **Logo sizes:** `sm: 28px`, `md: 48px`, `lg: 56px` icon; title `text-base` (md), tagline `text-[10px]` with 0.15em tracking.

## Critical files

| File | Purpose |
|---|---|
| `docs/superpowers/specs/2026-04-17-phase-0-lead-capture-design.md` | Phase 0 design spec (source of truth) |
| `docs/superpowers/plans/2026-04-17-phase-0-lead-capture.md` | Phase 0 implementation plan (with version reconciliation note at top) |
| `docs/superpowers/specs/2026-04-17-lifecare-website-design.md` | Full marketing site spec (Phase 1+, deferred) |
| `docs/superpowers/plans/2026-04-17-phase-1-foundation.md` | Original Phase 1 plan (deferred) |
| `components/LeadForm.tsx` | The main form component — tabs, RHF, Zod, submit handler |
| `components/Logo.tsx` | Icon + wordmark with independent sizing |
| `lib/lead-schema.ts` | Zod discriminated union for services + employment leads |
| `lib/send-lead-email.ts` | Resend wrapper with subject-prefixed emails |
| `lib/site-config.ts` | Single source of truth: phone, address, hours, services |
| `app/api/lead/route.ts` | POST handler — honeypot + validation + email dispatch |

## What's left: Task 19 (Deployment)

User needs to:

1. **Create free Resend account** at resend.com → get API key (starts with `re_`)
2. **Verify mailboxes exist:** `intake@mylifecareoptions.com` and `jobs@mylifecareoptions.com`
3. **Create Vercel project** — import `github.com/clintusmc/Lifecare` repo, add `RESEND_API_KEY` env var, deploy `phase-0` branch first for preview
4. **Test the preview** — submit both forms, confirm emails arrive
5. **Merge `phase-0` → `main`** and let Vercel auto-deploy
6. **DNS cutover** from Wix to Vercel — update A record (`76.76.21.21`) and www CNAME (`cname.vercel-dns.com`) in Wix DNS panel
7. **Resend domain verification** (optional post-launch) — add SPF/DKIM/MX records to DNS, then set `RESEND_FROM="Lifecare Options <no-reply@mylifecareoptions.com>"` in Vercel env vars

Detailed click-by-click steps are in `docs/superpowers/plans/2026-04-17-phase-0-lead-capture.md` under "Task 19".

## Known flags

- **Lockup PNG has non-transparent cream background** — visible as a faint rectangle on the white site nav (acceptable) and will look bad on the dark navy footer. To fix: ask Nano Banana for a transparent-background version, replace `public/images/logo-icon.png`.
- **`medicareCcn` and `stateLicense` are `[TBD]` in `lib/site-config.ts`** — fill in before launch.
- **`public/images/logo-icon.png`** is the full lockup (unused now except as source for the cropped icon). `public/images/logo-square.png` is what the Logo component uses. Could delete `logo-icon.png` to save ~328KB if not needed.
- **Scaffold clutter still in repo** — `AGENTS.md`, `CLAUDE.md`, default `app/favicon.ico`. Not blocking, flagged in first code review. Clean up later.

## How to resume in a new chat

Paste this to Claude:

> I'm continuing work on my Lifecare Options website. Read `/Users/clintives/Documents/Claude/Projects/Lifecare Website/HANDOFF.md` to get up to speed. Today I want to [deploy to Vercel / make changes to X / etc.].
