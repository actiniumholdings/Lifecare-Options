# Lifecare Full Site — Plan 1: Foundation & Design System

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Lifecare phase-0 site to a bilingual `[locale]` App Router foundation, retrofit the design tokens to the approved template identity (Playfair + Inter, care-blue, mist), build the shared UI primitive library, and rebuild the existing home page in that identity — shipping a working, styled, tested home page.

**Architecture:** Build on the phase-0 Next.js 16 scaffold (keep `LeadForm → /api/lead → Resend`, `site-config`, `motion/react` helpers). Add `next-intl` v4 with a `[locale]` segment mirroring the sister site `central-home-health`. The token retrofit is centralized in `app/globals.css` (`@theme`) + `lib/fonts.ts`, so most existing components inherit the new look automatically. Add the missing UI primitives (`Container`, `Section`, `Eyebrow`, `Stat`, `Hero`, `Band`) that later pages will reuse.

**Tech Stack:** Next.js 16.2.x (App Router), React 19, TypeScript, Tailwind CSS v4, `next-intl` ^4.13, `motion` (`motion/react`), Vitest + Testing Library, Resend (existing).

## Global Constraints

_Every task's requirements implicitly include this section._

- **Next.js is unfamiliar:** per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` before using any Next 16 App Router API you're unsure of. APIs differ from training data.
- **Reference implementation:** the sister repo `~/Documents/Claude/Websites/central-home-health` uses the identical stack (Next 16 + next-intl v4 + Tailwind v4 + motion). Copy its *framework glue* patterns; do not invent APIs. Cited per task.
- **iCloud gotcha:** this repo is under iCloud. `cd` into the repo at the start of **every** Bash command. Before any `tsc`/`next build`, delete iCloud conflict copies: `find . -name "* [0-9].ts" -o -name "* [0-9].tsx" | grep -v node_modules` then remove offenders (they break `tsc`).
- **Design tokens (canonical, spec §5):** navy `#0F2B47`, care-blue `#5A8BB8` (primary accent/CTA/eyebrow), cream `#FDEEDD` (peach warmth), mist `#F7FAFC` (base bg), slate `#6B7D92`, success `#2D6A4F`, alert `#C0392B`, border `#E4ECF3`. Fonts: Playfair Display (display) + Inter (body).
- **i18n:** locales `["en","es"]`, default `en`, `localePrefix: "as-needed"` (EN at `/`, ES at `/es`). `en.json` authored this plan; `es.json` is a stub (same key shape, values = English placeholder or empty — authored in Spec 2).
- **No hardcoded UI copy** in components — all user-facing strings come from `next-intl` messages.
- **Copy voice:** warm, clinician-led, plain; de-AI (no "seamless/empower/at the heart of", no em-dash-itis); never copy-paste Central's text.
- **Commits:** frequent TDD commits locally. Squash before any push. **Never push without asking.** Keep tests tracked. **Do not touch the user's uncommitted `phase-0` WIP** (`HeroIllustration.tsx`, `smoke.test.tsx`, `public/images/hero-photo.jpg`, `public/videos/`).
- **Green gate:** a task's final "verify" step must show `vitest` (relevant tests) passing; the plan's last task runs `typecheck` + `lint` + full `test` + `next build` all green.

---

## File Structure

**Create:**
- `i18n/routing.ts` — locale routing config (en, es, as-needed)
- `i18n/request.ts` — `getRequestConfig` loading `messages/{locale}.json`
- `middleware.ts` — `next-intl` locale middleware (needed for 2 locales)
- `messages/en.json` — English UI strings (nav, common, home)
- `messages/es.json` — stub (same shape)
- `app/[locale]/layout.tsx` — `NextIntlClientProvider` + fonts + Header/Footer/SkipLink
- `app/[locale]/page.tsx` — home (moved + rebuilt from `app/page.tsx`)
- `components/ui/Container.tsx`, `Section.tsx`, `Eyebrow.tsx`, `Stat.tsx`, `Hero.tsx`, `Band.tsx`
- `components/a11y/SkipLink.tsx`
- Tests alongside each under `tests/`

**Modify:**
- `next.config.ts` — wrap with `createNextIntlPlugin`
- `lib/fonts.ts` — Playfair Display + Inter
- `app/globals.css` — `@theme` tokens (fonts + palette + mist bg)
- `app/layout.tsx` — reduce to `<html>`-less root returning children + `metadataBase`
- `components/Nav.tsx`, `components/Footer.tsx` — consume `next-intl`, retoken (reconcile removed drift tokens)
- Any component referencing removed tokens (`cream-deep`, `cream-edge`, `footer-muted`, `--font-spectral`, `--font-albert`)

**Delete/relocate:**
- `app/page.tsx` (moved into `app/[locale]/`)

---

## Task 0: Isolated branch off a clean base (preserve user WIP)

**Files:** none (git only)

- [ ] **Step 1: Create an isolated worktree at the phase-0 committed HEAD**

REQUIRED SUB-SKILL: use `superpowers:using-git-worktrees`. The user's uncommitted WIP lives in the main working tree and must stay untouched — a worktree at the committed `phase-0` HEAD gives a clean base without those changes.

Run:
```bash
cd ~/Documents/Claude/Projects/"Lifecare Website"
git worktree add -b feat/full-site ../lifecare-full-site phase-0
cd ../lifecare-full-site && git status
```
Expected: new worktree on branch `feat/full-site`, `working tree clean` (the WIP files do NOT appear here).

- [ ] **Step 2: Install deps in the worktree & confirm baseline green**

Run:
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
npm install
npm run test
```
Expected: existing 34 tests pass (baseline before changes). All subsequent tasks run in this worktree.

---

## Task 1: Install and configure next-intl

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`
- Modify: `next.config.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Produces: `routing` (from `i18n/routing.ts`) with `.locales = ["en","es"]`, `.defaultLocale = "en"`.

- [ ] **Step 1: Install next-intl**

Run:
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
npm install next-intl@^4.13.0
```
Expected: `next-intl` added to `dependencies`.

- [ ] **Step 2: Write the failing test**

Create `tests/i18n.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing", () => {
  it("supports English and Spanish with English default", () => {
    expect(routing.locales).toEqual(["en", "es"]);
    expect(routing.defaultLocale).toBe("en");
  });
});
```

- [ ] **Step 3: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/i18n.test.ts`
Expected: FAIL — cannot resolve `@/i18n/routing`.

- [ ] **Step 4: Create the routing + request config**

Create `i18n/routing.ts` (adapted from Central `i18n/routing.ts`, with `es` added):
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English served at `/`, Spanish prefixed at `/es`.
  localePrefix: "as-needed",
});
```

Create `i18n/request.ts` (copy of Central `i18n/request.ts`):
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Add the middleware (required for 2 locales)**

Central omits `middleware.ts` because it has a single locale; Lifecare has two, so locale negotiation/redirects need it. Create `middleware.ts`:
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, the API routes, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```
> Verify the middleware export shape against `node_modules/next-intl` if types complain.

- [ ] **Step 6: Wrap next.config with the plugin**

Modify `next.config.ts` — add at top and wrap the export (mirror Central `next.config.ts`):
```ts
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
// ...existing nextConfig...
export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/i18n.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add i18n/ middleware.ts next.config.ts tests/i18n.test.ts package.json package-lock.json
git commit -m "feat: add next-intl v4 routing (en + es)"
```

---

## Task 2: Retrofit fonts and design tokens

**Files:**
- Modify: `lib/fonts.ts`, `app/globals.css`
- Test: `tests/fonts.test.ts`

**Interfaces:**
- Produces: `playfair`, `inter` (from `lib/fonts.ts`), each with a `.variable` string (`--font-playfair`, `--font-inter`).

- [ ] **Step 1: Write the failing test**

Create `tests/fonts.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { playfair, inter } from "@/lib/fonts";

describe("fonts", () => {
  it("exposes CSS variables for Playfair Display and Inter", () => {
    expect(playfair.variable).toBe("--font-playfair");
    expect(inter.variable).toBe("--font-inter");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/fonts.test.ts`
Expected: FAIL — current exports are `spectral` / `albert`.

- [ ] **Step 3: Replace `lib/fonts.ts`**

```ts
import { Playfair_Display, Inter } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
```

- [ ] **Step 4: Rewrite the `@theme` block in `app/globals.css`**

Replace the existing `@theme { ... }` and base styles with:
```css
@import "tailwindcss";

@theme {
  /* Palette — template identity */
  --color-navy: #0f2b47;
  --color-care-blue: #5a8bb8;
  --color-cream: #fdeedd;
  --color-mist: #f7fafc;
  --color-slate: #6b7d92;
  --color-success: #2d6a4f;
  --color-alert: #c0392b;
  --color-border: #e4ecf3;

  /* Typography */
  --font-display: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;

  /* Rhythm & shape */
  --spacing-section-y-desktop: 6rem;
  --spacing-section-y-mobile: 3.5rem;
  --radius-card: 0.5rem;
  --radius-pill: 9999px;
}

html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}
body {
  background: var(--color-mist);
  color: var(--color-navy);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
}
h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-navy);
  font-weight: 500;
  line-height: 1.05;
}
h1 { font-size: clamp(2.5rem, 6vw, 4rem); }
h2 { font-size: clamp(2rem, 4.5vw, 3rem); }
h3 { font-size: 1.5rem; }
section[id] { scroll-margin-top: 5rem; }
:focus-visible {
  outline: 2px solid var(--color-navy);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 5: Reconcile removed drift tokens**

Find any references to tokens/vars this retrofit removed:
```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
grep -rnE "cream-deep|cream-edge|footer-muted|font-spectral|font-albert|spectral|albert" app components lib --include=*.tsx --include=*.ts --include=*.css
```
For each hit: replace `bg-cream-deep`/`bg-cream-edge` → `bg-cream` or `bg-border`; footer muted text → `text-cream/65` (or a `text-slate` on light); `font-spectral`→`font-display`, `font-albert`→`font-sans`. Fix all so nothing references a deleted token.

- [ ] **Step 6: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/fonts.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/fonts.ts app/globals.css app components
git commit -m "feat: retrofit design tokens to template identity (Playfair/Inter/mist/care-blue)"
```

---

## Task 3: SkipLink + [locale] layout + messages scaffold

**Files:**
- Create: `components/a11y/SkipLink.tsx`, `app/[locale]/layout.tsx`, `messages/en.json`, `messages/es.json`
- Modify: `app/layout.tsx`
- Test: `tests/skip-link.test.tsx`

**Interfaces:**
- Consumes: `playfair`, `inter` (Task 2); `routing` (Task 1).
- Produces: `messages/en.json` with top-level keys `common`, `nav`, `home`. `<SkipLink/>` renders an anchor to `#main`.

- [ ] **Step 1: Write the failing test**

Create `tests/skip-link.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/a11y/SkipLink";

describe("SkipLink", () => {
  it("links to the main landmark", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main/i });
    expect(link).toHaveAttribute("href", "#main");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/skip-link.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/a11y/SkipLink.tsx`**

```tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-mist"
    >
      Skip to main content
    </a>
  );
}
```

- [ ] **Step 4: Create the messages scaffold**

Create `messages/en.json`:
```json
{
  "common": {
    "siteName": "Lifecare Options",
    "tagline": "Home Health",
    "skipToContent": "Skip to main content",
    "callUs": "Call",
    "requestInfo": "Request info",
    "toggleMenu": "Toggle menu",
    "close": "Close"
  },
  "nav": {
    "services": "Services",
    "serviceArea": "Service Area",
    "about": "About",
    "careers": "Careers",
    "refer": "Refer a Patient",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "eyebrow": "Home Health · Katy, TX",
      "headline1": "Quality care,",
      "headline2": "felt at home.",
      "intro": "Medicare-certified skilled nursing, therapy, and personal care across Katy, Fort Bend, and Harris counties since 2008.",
      "ctaCall": "Call {phone}",
      "ctaRequest": "Request info"
    }
  }
}
```

Create `messages/es.json` as a same-shape stub (English values are fine for now — Spec 2 translates):
```json
{
  "common": {
    "siteName": "Lifecare Options",
    "tagline": "Home Health",
    "skipToContent": "Skip to main content",
    "callUs": "Call",
    "requestInfo": "Request info",
    "toggleMenu": "Toggle menu",
    "close": "Close"
  },
  "nav": {
    "services": "Services",
    "serviceArea": "Service Area",
    "about": "About",
    "careers": "Careers",
    "refer": "Refer a Patient",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "eyebrow": "Home Health · Katy, TX",
      "headline1": "Quality care,",
      "headline2": "felt at home.",
      "intro": "Medicare-certified skilled nursing, therapy, and personal care across Katy, Fort Bend, and Harris counties since 2008.",
      "ctaCall": "Call {phone}",
      "ctaRequest": "Request info"
    }
  }
}
```

- [ ] **Step 5: Reduce the root layout**

Replace `app/layout.tsx` with (mirror Central):
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mylifecareoptions.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```
> `SITE_URL` becomes a shared constant in Plan 3 (`lib/metadata.ts`); hardcode it here for now.

- [ ] **Step 6: Create `app/[locale]/layout.tsx`**

Adapt Central's `app/[locale]/layout.tsx` — Lifecare fonts, no JsonLd yet (Plan 3), reuse existing `Nav`/`Footer` (Task will retoken them):
```tsx
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { playfair, inter } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/a11y/SkipLink";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipLink />
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
> If `Nav`/`Footer` are `"use client"` and read copy, convert them to consume `useTranslations("nav"/"common")`. Read their current source first and adapt minimally (retoken only).

- [ ] **Step 7: Run the SkipLink test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/skip-link.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/a11y app/layout.tsx app/[locale]/layout.tsx messages/ components/Nav.tsx components/Footer.tsx tests/skip-link.test.tsx
git commit -m "feat: add [locale] layout, messages scaffold, and skip link"
```

---

## Task 4: Container + Section primitives

**Files:**
- Create: `components/ui/Container.tsx`, `components/ui/Section.tsx`
- Test: `tests/ui/section.test.tsx`

**Interfaces:**
- Produces:
  - `Container({ as?, className?, children })` — centered max-w column.
  - `Section({ tone?: "light" | "dark", id?, className?, children })` — full-width band; `dark` = navy bg + care-blue hairline top + light text.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/section.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/ui/Section";

describe("Section", () => {
  it("renders children inside a section landmark", () => {
    render(<Section id="why"><p>hello</p></Section>);
    const el = document.getElementById("why");
    expect(el?.tagName).toBe("SECTION");
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies the dark tone background", () => {
    const { container } = render(<Section tone="dark">x</Section>);
    expect(container.querySelector("section")?.className).toContain("bg-navy");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/section.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `components/ui/Container.tsx`**

```tsx
import type { ElementType, ReactNode } from "react";

export function Container({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-4 md:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Create `components/ui/Section.tsx`**

```tsx
import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({
  tone = "light",
  id,
  className = "",
  children,
}: {
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "dark" ? "bg-navy text-mist" : "bg-mist text-navy";
  return (
    <section
      id={id}
      className={`relative py-14 md:py-24 ${toneClass} ${className}`}
    >
      {tone === "dark" && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-care-blue/40"
        />
      )}
      <Container>{children}</Container>
    </section>
  );
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/section.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Container.tsx components/ui/Section.tsx tests/ui/section.test.tsx
git commit -m "feat: add Container and Section primitives"
```

---

## Task 5: Eyebrow + Stat primitives

**Files:**
- Create: `components/ui/Eyebrow.tsx`, `components/ui/Stat.tsx`
- Test: `tests/ui/eyebrow-stat.test.tsx`

**Interfaces:**
- Produces:
  - `Eyebrow({ children, className? })` — care-blue uppercase tracked label.
  - `Stat({ value, label, tone? })` — Playfair numeral + label.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/eyebrow-stat.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";

describe("Eyebrow", () => {
  it("renders its label uppercase-styled in care-blue", () => {
    const { container } = render(<Eyebrow>Our Services</Eyebrow>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("text-care-blue");
    expect(el.className).toContain("uppercase");
    expect(screen.getByText("Our Services")).toBeInTheDocument();
  });
});

describe("Stat", () => {
  it("renders value and label", () => {
    render(<Stat value="2008" label="Serving Katy since" />);
    expect(screen.getByText("2008")).toBeInTheDocument();
    expect(screen.getByText("Serving Katy since")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/eyebrow-stat.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `components/ui/Eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-xs font-semibold uppercase tracking-[0.16em] text-care-blue ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/ui/Stat.tsx`**

```tsx
export function Stat({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const labelColor = tone === "dark" ? "text-mist/70" : "text-slate";
  return (
    <div>
      <div className="font-display text-3xl leading-none md:text-4xl">
        {value}
      </div>
      <div className={`mt-1 text-sm ${labelColor}`}>{label}</div>
    </div>
  );
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/eyebrow-stat.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Eyebrow.tsx components/ui/Stat.tsx tests/ui/eyebrow-stat.test.tsx
git commit -m "feat: add Eyebrow and Stat primitives"
```

---

## Task 6: Hero + Band primitives (illustration/gradient)

**Files:**
- Create: `components/ui/Hero.tsx`, `components/ui/Band.tsx`
- Test: `tests/ui/hero.test.tsx`

**Interfaces:**
- Consumes: `Container` (Task 4), `Eyebrow` (Task 5), existing `Button` (`components/Button.tsx`).
- Produces:
  - `Hero({ eyebrow, headline, intro?, primaryCta?, secondaryCta?, children? })` — mist hero with the template's floating gradient tile. `headline` is a `ReactNode` (renders inside a live `<h1>`). `primaryCta`/`secondaryCta` = `{ label, href }`.
  - `Band({ eyebrow?, headline, className? })` — quiet peach-cream editorial band.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/hero.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/ui/Hero";

describe("Hero", () => {
  it("renders the headline as an h1 and the eyebrow", () => {
    render(<Hero eyebrow="Home Health · Katy, TX" headline="Quality care, felt at home." />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Quality care, felt at home.");
    expect(screen.getByText("Home Health · Katy, TX")).toBeInTheDocument();
  });

  it("renders CTAs as links when provided", () => {
    render(
      <Hero
        eyebrow="e"
        headline="h"
        primaryCta={{ label: "Request info", href: "#contact" }}
      />,
    );
    expect(screen.getByRole("link", { name: "Request info" })).toHaveAttribute("href", "#contact");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/ui/Hero.tsx`**

> First read `components/Button.tsx` to confirm its prop shape (`href`, `variant`, `size`). Adapt the CTA rendering to match. The code below assumes `Button` accepts `href`, `variant` (`"primary" | "secondary"`), `size`.
```tsx
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };

export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
  children,
}: {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  children?: ReactNode;
}) {
  return (
    <section className="bg-mist px-4 py-12 md:px-8 md:py-24">
      <Container className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3">{headline}</h1>
          {intro && <p className="mt-5 max-w-xl text-lg text-slate">{intro}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {primaryCta && (
                <Button href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="secondary" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="relative min-h-64">
          {children ?? (
            <div
              aria-hidden
              className="aspect-[4/3] w-full rounded-2xl"
              style={{ background: "linear-gradient(135deg, #E4ECF3 0%, #FDEEDD 100%)" }}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/ui/Band.tsx`**

```tsx
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function Band({
  eyebrow,
  headline,
  className = "",
}: {
  eyebrow?: ReactNode;
  headline: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-cream px-4 py-16 md:px-8 md:py-20 ${className}`}>
      <Container>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <p className="mt-3 max-w-3xl font-display text-2xl leading-snug text-navy md:text-3xl">
          {headline}
        </p>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/ui/hero.test.tsx`
Expected: PASS. (If `Button` needs different props, adjust Hero + rerun.)

- [ ] **Step 6: Commit**

```bash
git add components/ui/Hero.tsx components/ui/Band.tsx tests/ui/hero.test.tsx
git commit -m "feat: add Hero and Band primitives"
```

---

## Task 7: Migrate + rebuild the home page under [locale]

**Files:**
- Create: `app/[locale]/page.tsx`
- Delete: `app/page.tsx`
- Test: `tests/home.test.tsx`

**Interfaces:**
- Consumes: `Hero`, `Section`, `Eyebrow`, `Stat` (Tasks 4–6); existing `LeadForm`, `ServicesList`, `TrustBadge` components; `siteConfig`, `services` (`lib/site-config.ts`); `useTranslations`.

- [ ] **Step 1: Read the current home to preserve behavior**

Read `app/page.tsx` fully. It already composes Hero + trust + services grid + LeadForm + footer with `motion/react`. Preserve the working sections and the `LeadForm`; the rebuild swaps bespoke markup for the new primitives and moves copy into `messages`.

- [ ] **Step 2: Write the failing test**

Create `tests/home.test.tsx` (component-level; wrap in `NextIntlClientProvider` with the real `en.json`):
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import Home from "@/app/[locale]/page";

function renderHome() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Home />
    </NextIntlClientProvider>,
  );
}

describe("Home page", () => {
  it("shows the hero headline", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toHaveTextContent(/felt at home/i);
  });
});
```
> If the home page is an async server component reading `params`, refactor its top-level to a synchronous client-safe composition (sections are client components already via `motion`), OR export the section stack as a testable `HomeContent` component and test that. Choose whichever keeps the render test meaningful; document the choice in the commit.

- [ ] **Step 3: Run it — verify it fails**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/home.test.tsx`
Expected: FAIL — `@/app/[locale]/page` not found.

- [ ] **Step 4: Create `app/[locale]/page.tsx`**

Rebuild the home using the new primitives and `useTranslations("home")`. Compose (per spec §7.1): `Hero` → trust `Section` (Stats) → services grid (reuse `ServicesList`/`services`) → the remaining home sections are **stubbed as empty `Section`s with headings** here and fully built in Plan 2 (How It Works, Why Lifecare, Band, Service-Area teaser, Testimonials, Careers teaser, Final CTA). Keep the existing `LeadForm` in a `#contact` section. Example skeleton:
```tsx
"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { ServicesList } from "@/components/ServicesList";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const t = useTranslations("home");
  return (
    <>
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={
          <>
            {t("hero.headline1")}
            <br />
            {t("hero.headline2")}
          </>
        }
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.ctaRequest"), href: "#contact" }}
        secondaryCta={{ label: t("hero.ctaCall", { phone: siteConfig.phone }), href: siteConfig.phoneHref }}
      />

      <Section tone="light" id="trust" className="!py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat value={String(siteConfig.foundedYear)} label="Serving Katy since" />
          <Stat value="Medicare" label="certified" />
          <Stat value="CHAP" label="accredited" />
          <Stat value="24/7" label="on-call nursing" />
        </div>
      </Section>

      <Section tone="light" id="services">
        <ServicesList />
      </Section>

      {/* Plan 2 fills: How It Works, Why Lifecare, Band, Service-Area teaser, Testimonials, Careers teaser, Final CTA */}

      <Section tone="light" id="contact">
        <LeadForm />
      </Section>
    </>
  );
}
```
> Read `ServicesList` + `LeadForm` props first and wire them as they expect. If `ServicesList` hardcodes copy, leave it for Plan 2's copy pass — the goal here is a compiling, styled home under `[locale]`.

- [ ] **Step 5: Delete the old route**

```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
git rm app/page.tsx
```

- [ ] **Step 6: Run the test — verify it passes**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npx vitest run tests/home.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add "app/[locale]/page.tsx" tests/home.test.tsx
git commit -m "feat: migrate home page to [locale] with new design primitives"
```

---

## Task 8: Full green gate (typecheck, lint, tests, build, visual)

**Files:** none (verification + fixes)

- [ ] **Step 1: Remove iCloud conflict copies**

```bash
cd ~/Documents/Claude/Projects/lifecare-full-site
find . -path ./node_modules -prune -o \( -name "* 2.ts" -o -name "* 2.tsx" -o -name "* 2.css" -o -name "* 2.json" \) -print -delete
```

- [ ] **Step 2: Typecheck**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npm run typecheck`
Expected: 0 errors. Fix any (commonly: leftover `spectral`/`albert` imports, `params` typing, missing message keys).

- [ ] **Step 3: Lint**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npm run lint`
Expected: 0 errors.

- [ ] **Step 4: Full test suite**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npm run test`
Expected: all pass — the prior 34 tests plus the new i18n/fonts/ui/home tests. Fix any regressions (the LeadForm tests must stay green).

- [ ] **Step 5: Production build**

Run: `cd ~/Documents/Claude/Projects/lifecare-full-site && npm run build`
Expected: build succeeds; `/` and `/es` (and `/en`) routes generated via `generateStaticParams`.

- [ ] **Step 6: Visual check**

Run `npm run dev`, open `http://localhost:3000/` and `http://localhost:3000/es`. Confirm: Playfair headlines, Inter body, mist background, care-blue CTAs, hero gradient tile, services grid, working lead form. Note the port if 3000 is taken.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "chore: green gate — typecheck, lint, tests, build pass for foundation"
```

---

## Definition of done (Plan 1)

- `next-intl` v4 wired; `/`, `/en`, `/es` all render the home page.
- Design tokens = template identity (Playfair + Inter, mist bg, care-blue accent); no references to removed drift tokens.
- UI primitives (`Container`, `Section`, `Eyebrow`, `Stat`, `Hero`, `Band`) exist, tested, and used by home.
- Home page migrated under `[locale]`, styled, lead form working; remaining home sections stubbed for Plan 2.
- `typecheck` + `lint` + `test` + `build` all green. User's `phase-0` WIP untouched (separate worktree).

**Next:** Plan 2 — Pages & Content (8 remaining pages + nav/footer copy + ServiceMap + full `en.json`).
