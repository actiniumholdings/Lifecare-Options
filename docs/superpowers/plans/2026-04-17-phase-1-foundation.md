# Lifecare Options Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed Next.js scaffold on Vercel with full design tokens, global Nav + Footer, a homepage shell with all 10 sections as named placeholders, one fully-templated service sub-page route, and a green CI build — ready for Phase 2 content to drop in.

**Architecture:** Next.js 15 App Router with Tailwind v4, shadcn/ui primitives, MDX for content, Framer Motion for motion, deployed to Vercel. TypeScript strict. Vitest + Testing Library for component tests. Everything follows the design system in `docs/superpowers/specs/2026-04-17-lifecare-website-design.md`.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.5, Tailwind CSS v4, shadcn/ui, Radix UI primitives, Framer Motion 11, MDX via `@next/mdx`, Playfair Display + Inter (Google Fonts), Vitest 2, Testing Library, vitest-axe for a11y checks.

---

## Prerequisites (one-time, done by user before Task 1)

- [ ] **Save approved logo icon** at `public/images/logo-icon.png` (from Nano Banana generation 2026-04-17). PNG with transparent background, ~1024×1024.
- [ ] **Create Vercel project** — link to the GitHub repo that holds this project. Don't set the production domain yet (that's Phase 4).
- [ ] **Obtain Resend API key** — free tier. Save as `RESEND_API_KEY` in Vercel environment variables (used in Phase 2, but configure now).
- [ ] **Obtain GitHub repo** — create `lifecare-website` repo under Clint's account, push the existing `Lifecare Website/` folder as initial commit (spec + logo).

---

## File Structure (created during this plan)

```
/app
  layout.tsx                         Root layout — fonts, metadata, global wrappers
  page.tsx                           Homepage (scaffold with 10 section placeholders)
  globals.css                        Tailwind entry + base styles
  not-found.tsx                      404 page
  services/
    page.tsx                         Services overview (Phase 2 content)
    [slug]/page.tsx                  Individual service (uses MDX)

/components
  Logo.tsx                           Icon + typeset wordmark
  Nav.tsx                            Desktop + mobile nav
  Footer.tsx                         Site footer with 4 columns
  Button.tsx                         Primary / Secondary / Tertiary variants
  Card.tsx                           PeachCream / Mist / White variants
  TrustBadge.tsx                     Success-green pill with checkmark
  StatTile.tsx                       Large Playfair numeral + Inter label
  SectionHeader.tsx                  Eyebrow + H2 + optional subhead

/content
  services/
    skilled-nursing.mdx              Sample MDX file — other 5 follow in Phase 2

/lib
  fonts.ts                           next/font configuration
  site-config.ts                     Phone, address, hours, nav links — single source

/public/images
  logo-icon.png                      Supplied by user (Nano Banana output)

/tests
  components/Nav.test.tsx            Mobile menu open/close behavior
  components/Button.test.tsx         Variant rendering

Configuration files:
  package.json
  tsconfig.json
  tailwind.config.ts
  postcss.config.mjs
  next.config.mjs
  vitest.config.ts
  eslint.config.mjs
  .prettierrc
  .gitignore
  README.md
```

---

## Task 1: Initialize Next.js 15 project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.gitignore`, `README.md`

- [ ] **Step 1: Run create-next-app with flags**

From the project root (`/Users/clintives/Documents/Claude/Projects/Lifecare Website/`):

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm
```

When prompted about `Would you like to customize the default import alias`, accept `@/*`. This scaffolds into the current directory.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion next-mdx-remote gray-matter resend leaflet react-leaflet @types/leaflet clsx tailwind-merge lucide-react
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @vitest/ui @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest-axe @types/node prettier prettier-plugin-tailwindcss eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-next
```

- [ ] **Step 3a: Force Tailwind v4**

`create-next-app` scaffolding varies — some versions still install Tailwind v3. Force v4 explicitly:

```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest
npm uninstall autoprefixer 2>/dev/null || true
```

- [ ] **Step 4: Verify baseline works**

```bash
npm run dev
```

Expected: Next.js starts on http://localhost:3000 showing the default welcome page. Press Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with core dependencies"
```

---

## Task 2: Configure TypeScript strict, ESLint, Prettier

**Files:**
- Modify: `tsconfig.json`
- Create: `eslint.config.mjs`, `.prettierrc`

- [ ] **Step 1: Replace tsconfig.json with strict config**

Overwrite `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Create eslint.config.mjs**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next(),
  {
    ignores: [".next/**", "node_modules/**", "public/**"],
  },
];
```

- [ ] **Step 3: Create .prettierrc**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 4: Add lint + format scripts to package.json**

Edit `package.json` — merge these into the existing `scripts` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Verify**

```bash
npm run typecheck
npm run lint
```

Expected: both pass with no errors.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json eslint.config.mjs .prettierrc package.json
git commit -m "chore: configure strict TypeScript, ESLint, Prettier"
```

---

## Task 3: Configure Tailwind v4 with full design tokens

**Files:**
- Modify: `app/globals.css`
- Delete: `tailwind.config.ts` (if one was generated — Tailwind v4 uses CSS-based config)

- [ ] **Step 1: Remove legacy Tailwind config + write postcss config**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

Create `postcss.config.mjs` (overwrite whatever create-next-app generated):

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 2: Replace app/globals.css with design-token config**

Overwrite `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Palette (from spec §6) */
  --color-navy: #0f2b47;
  --color-care-blue: #5a8bb8;
  --color-peach-cream: #fdeedd;
  --color-mist: #f7fafc;
  --color-slate: #6b7d92;
  --color-success-green: #2d6a4f;
  --color-alert-red: #c0392b;
  --color-borderline: #e4ecf3;

  /* Typography */
  --font-display: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;

  /* Spacing rhythm — 4px base grid */
  --spacing-section-y-desktop: 6rem; /* 96px */
  --spacing-section-y-mobile: 3.5rem; /* 56px */

  /* Radius */
  --radius-card: 0.75rem; /* 12px */
  --radius-pill: 9999px;
}

/* Base element styling */
html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  background: #ffffff;
  color: var(--color-navy);
  font-family: var(--font-sans);
  font-size: 1.0625rem; /* 17px body */
  line-height: 1.65;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-navy);
  font-weight: 500;
  line-height: 1.1;
}

/* Focus ring — accessible and on-brand */
:focus-visible {
  outline: 2px solid var(--color-care-blue);
  outline-offset: 2px;
  border-radius: 4px;
}
```

- [ ] **Step 3: Verify Tailwind compiles**

```bash
npm run build
```

Expected: build succeeds, produces `.next/` directory.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css postcss.config.mjs
git rm -f tailwind.config.ts 2>/dev/null || true
git commit -m "feat: configure Tailwind v4 with design tokens"
```

---

## Task 4: Configure Google Fonts (Playfair Display + Inter)

**Files:**
- Create: `lib/fonts.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create lib/fonts.ts**

```ts
import { Inter, Playfair_Display } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
});
```

- [ ] **Step 2: Replace app/layout.tsx with font-aware root layout**

Overwrite `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lifecare Options — Home Health in Katy, TX",
    template: "%s · Lifecare Options",
  },
  description:
    "Medicare-certified home health in Katy, Fort Bend, and Harris counties. Skilled nursing, therapy, and personal care delivered at home since 2008.",
  metadataBase: new URL("https://www.mylifecareoptions.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white text-navy">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify fonts load**

```bash
npm run dev
```

Open http://localhost:3000. View page source and confirm `<style>` blocks for Playfair + Inter appear. Stop server.

- [ ] **Step 4: Commit**

```bash
git add lib/fonts.ts app/layout.tsx
git commit -m "feat: wire Playfair Display + Inter via next/font"
```

---

## Task 5: Create site-config (single source for phone, address, nav links)

**Files:**
- Create: `lib/site-config.ts`

- [ ] **Step 1: Create lib/site-config.ts**

```ts
export const siteConfig = {
  name: "Lifecare Options",
  tagline: "Home Health",
  phone: "(281) 646-9546",
  phoneHref: "tel:+12816469546",
  fax: "(281) 646-9757",
  email: "intake@mylifecareoptions.com",
  address: {
    street: "434 Park Grove Dr",
    city: "Katy",
    state: "TX",
    zip: "77450",
  },
  hours: [
    { days: "Mon–Thu", time: "8:00 AM – 5:00 PM" },
    { days: "Fri", time: "8:00 AM – 4:00 PM" },
  ],
  onCall: "24/7 on-call nursing",
  foundedYear: 2008,
  accreditation: "CHAP-accredited",
} as const;

export const services = [
  { slug: "skilled-nursing", name: "Skilled Nursing" },
  { slug: "physical-therapy", name: "Physical Therapy" },
  { slug: "occupational-therapy", name: "Occupational Therapy" },
  { slug: "speech-therapy", name: "Speech Therapy" },
  { slug: "medical-social-work", name: "Medical Social Work" },
  { slug: "home-health-aide", name: "Home Health Aide" },
] as const;

export const primaryNav = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "Service Area", href: "/service-area" },
  { label: "Insurance", href: "/insurance" },
  { label: "For Providers", href: "/for-providers" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
] as const;
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/site-config.ts
git commit -m "feat: add site-config as single source for contact + nav"
```

---

## Task 6: Build Logo component

**Files:**
- Create: `components/Logo.tsx`

**Dependency:** `public/images/logo-icon.png` must exist (prerequisite).

- [ ] **Step 1: Create components/Logo.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  /** Visual size. Default "md". */
  size?: "sm" | "md" | "lg";
  /** If true, renders icon only, no wordmark. */
  iconOnly?: boolean;
  /** Override color scheme for dark backgrounds. */
  inverse?: boolean;
};

const SIZES = {
  sm: { icon: 28, text: "text-sm", sub: "text-[9px]" },
  md: { icon: 36, text: "text-base", sub: "text-[10px]" },
  lg: { icon: 56, text: "text-2xl", sub: "text-xs" },
} as const;

export function Logo({ size = "md", iconOnly = false, inverse = false }: LogoProps) {
  const s = SIZES[size];
  const textColor = inverse ? "text-white" : "text-navy";
  const subColor = inverse ? "text-peach-cream" : "text-slate";

  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label={`${siteConfig.name} home`}>
      <Image
        src="/images/logo-icon.png"
        alt=""
        width={s.icon}
        height={s.icon}
        priority
        className="rounded-lg"
      />
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span className={`font-display font-medium ${s.text} ${textColor}`}>
            {siteConfig.name}
          </span>
          <span className={`mt-1 font-sans uppercase tracking-widest ${s.sub} ${subColor}`}>
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes. If `@/lib/site-config` resolution fails, confirm `tsconfig.json` `paths` is set to `"@/*": ["./*"]`.

- [ ] **Step 3: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat: add Logo component with icon + typeset wordmark"
```

---

## Task 7: Build Button component with variants

**Files:**
- Create: `components/Button.tsx`
- Create: `tests/components/Button.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Button.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders primary variant by default with care-blue background", () => {
    render(<Button>Request Care</Button>);
    const btn = screen.getByRole("button", { name: /request care/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/bg-care-blue/);
  });

  it("renders secondary variant as outlined", () => {
    render(<Button variant="secondary">Call</Button>);
    expect(screen.getByRole("button").className).toMatch(/border/);
  });

  it("renders as <a> when href is provided", () => {
    render(<Button href="/request-care">Request</Button>);
    const link = screen.getByRole("link", { name: /request/i });
    expect(link).toHaveAttribute("href", "/request-care");
  });

  it("forwards aria-label", () => {
    render(<Button aria-label="Call LCO">(281) 646-9546</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Call LCO");
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test -- Button
```

Expected: FAIL. `Button` module not found.

- [ ] **Step 3: Create components/Button.tsx**

```tsx
import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

type ButtonAsLink = BaseProps & {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-care-blue text-white hover:bg-[#4a7aa3] rounded-full",
  secondary:
    "bg-white text-navy border-[1.5px] border-navy hover:bg-mist rounded-full",
  tertiary:
    "bg-transparent text-care-blue hover:text-navy underline-offset-4 hover:underline",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    "aria-label": ariaLabel,
  } = props;

  const classes = twMerge(
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- Button
```

Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Button.tsx tests/components/Button.test.tsx
git commit -m "feat: add Button component with primary/secondary/tertiary variants"
```

---

## Task 8: Set up Vitest config

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

(`@vitejs/plugin-react` was already installed in Task 1.)

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 2: Create tests/setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Re-run tests to confirm config works**

```bash
npm test
```

Expected: all Button tests still pass. No config errors.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json package-lock.json
git commit -m "chore: configure Vitest with React, jsdom, axe matchers"
```

---

## Task 9: Build display components (Card, TrustBadge, StatTile, SectionHeader)

**Files:**
- Create: `components/Card.tsx`, `components/TrustBadge.tsx`, `components/StatTile.tsx`, `components/SectionHeader.tsx`

These are pure-markup components — no state, no logic. No tests needed (tested indirectly by pages that use them).

- [ ] **Step 1: Create components/Card.tsx**

```tsx
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  variant?: "peach" | "mist" | "white";
  children: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  peach: "bg-peach-cream",
  mist: "bg-mist border border-borderline",
  white: "bg-white border border-borderline",
};

export function Card({ variant = "white", children, className }: CardProps) {
  return (
    <div
      className={twMerge("rounded-xl p-6", VARIANT[variant], className)}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create components/TrustBadge.tsx**

```tsx
type TrustBadgeProps = {
  children: React.ReactNode;
};

export function TrustBadge({ children }: TrustBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-medium text-success-green">
      <span aria-hidden>✓</span>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create components/StatTile.tsx**

```tsx
type StatTileProps = {
  value: string;
  label: string;
  description?: string;
};

export function StatTile({ value, label, description }: StatTileProps) {
  return (
    <div className="rounded-xl bg-mist p-6">
      <div className="font-display text-3xl text-care-blue">{value}</div>
      <div className="mt-1 text-sm font-semibold text-navy">{label}</div>
      {description && (
        <div className="mt-1 text-xs text-slate">{description}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create components/SectionHeader.tsx**

```tsx
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const maxW = align === "center" ? "max-w-2xl" : "max-w-3xl";

  return (
    <div className={`${maxW} ${alignCls} mb-10`}>
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-2 text-3xl leading-[1.1] md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-slate">{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add components/Card.tsx components/TrustBadge.tsx components/StatTile.tsx components/SectionHeader.tsx
git commit -m "feat: add Card, TrustBadge, StatTile, SectionHeader display components"
```

---

## Task 10: Build Nav component with mobile menu

**Files:**
- Create: `components/Nav.tsx`
- Create: `tests/components/Nav.test.tsx`

- [ ] **Step 1: Write failing test**

Create `tests/components/Nav.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Nav } from "@/components/Nav";

describe("Nav", () => {
  it("renders the site name", () => {
    render(<Nav />);
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });

  it("renders the phone number as a tel: link", () => {
    render(<Nav />);
    const phone = screen.getByRole("link", { name: /281.*9546/i });
    expect(phone).toHaveAttribute("href", "tel:+12816469546");
  });

  it("has a Request Care CTA", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /request care/i })).toHaveAttribute("href", "/request-care");
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test -- Nav
```

Expected: FAIL. `Nav` module not found.

- [ ] **Step 3: Create components/Nav.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig, primaryNav } from "@/lib/site-config";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-borderline bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo size="md" />

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-navy hover:text-care-blue"
            >
              {item.label}
              {item.hasDropdown && <span aria-hidden> ▾</span>}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={siteConfig.phoneHref}
            className="text-sm text-navy hover:text-care-blue"
          >
            {siteConfig.phone}
          </Link>
          <Button href="/request-care">Request Care →</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-borderline bg-white lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-navy"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={siteConfig.phoneHref}
                className="py-2 text-sm text-slate"
              >
                Call {siteConfig.phone}
              </Link>
              <Button href="/request-care" size="lg">
                Request Care →
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- Nav
```

Expected: all 4 Nav tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx tests/components/Nav.test.tsx
git commit -m "feat: add responsive Nav with mobile menu toggle"
```

---

## Task 11: Build Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create components/Footer.tsx**

```tsx
import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig, services } from "@/lib/site-config";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Service Area", href: "/service-area" },
  { label: "Insurance", href: "/insurance" },
  { label: "For Providers", href: "/for-providers" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="bg-navy text-[#a8b8cc]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Contact column */}
          <div>
            <Logo size="md" inverse />
            <div className="mt-4 space-y-1 text-sm leading-relaxed">
              <div>{siteConfig.address.street}</div>
              <div>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
              </div>
              <div>
                Phone:{" "}
                <Link href={siteConfig.phoneHref} className="text-white hover:underline">
                  {siteConfig.phone}
                </Link>
              </div>
              <div>Fax: {siteConfig.fax}</div>
            </div>
          </div>

          {/* Services column */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Services
            </div>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours column */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Hours
            </div>
            <ul className="space-y-1 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.days}>
                  <span className="text-white">{h.days}:</span> {h.time}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-peach-cream">{siteConfig.onCall}</div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} {siteConfig.name} Home Health Services ·
          Medicare-certified · {siteConfig.accreditation} · Equal opportunity employer
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with 4-column layout and site-config links"
```

---

## Task 12: Wire Nav + Footer into root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update app/layout.tsx**

Replace the existing `RootLayout` body:

```tsx
import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lifecare Options — Home Health in Katy, TX",
    template: "%s · Lifecare Options",
  },
  description:
    "Medicare-certified home health in Katy, Fort Bend, and Harris counties. Skilled nursing, therapy, and personal care delivered at home since 2008.",
  metadataBase: new URL("https://www.mylifecareoptions.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-navy">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server renders nav + footer**

```bash
npm run dev
```

Open http://localhost:3000. Confirm:
- Nav appears at top with logo, links, phone, Request Care button
- Footer appears at bottom with 4 columns
- Clicking the menu icon on mobile (resize window) toggles the mobile menu

Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire Nav and Footer into root layout"
```

---

## Task 13: Build homepage skeleton with all 10 named sections

**Files:**
- Modify: `app/page.tsx`

This task creates the homepage as an empty-but-labeled shell. Each section is a placeholder with the correct heading and styling so Phase 2 can drop in content cleanly.

- [ ] **Step 1: Replace app/page.tsx**

Overwrite `app/page.tsx`:

```tsx
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustBadge } from "@/components/TrustBadge";
import { siteConfig, services } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
              Home Health · Katy, TX
            </div>
            <h1 className="mt-3 text-5xl leading-[1.05] md:text-6xl">
              Quality care,
              <br />
              felt at home.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
              Medicare-certified skilled nursing, therapy, and personal care — delivered across Katy,
              Fort Bend, and Harris counties since {siteConfig.foundedYear}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/request-care" size="lg">
                Request Care →
              </Button>
              <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </Button>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-borderline to-peach-cream" aria-hidden>
            {/* Phase 2: watercolor illustration here */}
          </div>
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="border-y border-borderline bg-mist px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="font-display text-xl">Medicare-certified</div>
            <div className="text-xs text-slate">+ CHAP-accredited</div>
          </div>
          <div>
            <div className="font-display text-xl">Serving Katy since 2008</div>
            <div className="text-xs text-slate">Locally owned</div>
          </div>
          <div>
            <div className="font-display text-xl">24/7 on-call nursing</div>
            <div className="text-xs text-slate">Always reachable</div>
          </div>
        </div>
      </section>

      {/* 3. Services overview */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Our services"
            title="Six disciplines, one coordinated plan"
            subtitle="Physician-ordered home health covered by Medicare. Our team works together around your care plan — no handoff gaps."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {services.map((s, i) => {
              const variant = i % 3 === 0 ? "peach" : i % 3 === 1 ? "mist" : "white";
              return (
                <Card key={s.slug} variant={variant}>
                  <div className="font-display text-xl">{s.name}</div>
                  <div className="mt-2 text-sm text-slate">
                    {/* Phase 2: description copy per service */}
                    Coming in Phase 2
                  </div>
                  <div className="mt-3 text-sm text-care-blue">
                    Learn more →
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="bg-mist px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="How it works"
            title="From referral to care — usually in 48 hours"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: 1, title: "Refer", body: "Physician, hospital, family member, or patient — anyone can initiate. Fax, phone, or online form." },
              { n: 2, title: "Assess", body: "A registered nurse visits within 24–48 hours for a full clinical assessment and writes a personalized care plan." },
              { n: 3, title: "Begin care", body: "Your care team starts visits on schedule. 24/7 on-call nurse always available." },
            ].map((step) => (
              <Card key={step.n} variant="white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-care-blue text-sm font-semibold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-slate">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Service area */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
              Service area
            </div>
            <h2 className="mt-2 text-4xl">Greater Houston, with roots in Katy</h2>
            <p className="mt-4 text-base text-slate">
              We serve patients across Katy, Fort Bend, and Harris counties — including Cinco Ranch,
              Cypress, Richmond, Sugar Land, Houston, and surrounding areas.
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-borderline" aria-hidden>
            {/* Phase 3: Leaflet map here */}
          </div>
        </div>
      </section>

      {/* 6. Testimonial */}
      <section className="bg-navy px-4 py-20 text-center text-white md:px-6 md:py-28">
        <blockquote className="mx-auto max-w-3xl">
          <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
            {/* Phase 4: replace with real family testimonial */}
            &quot;Placeholder testimonial — real family quote coming in Phase 4.&quot;
          </p>
          <footer className="mt-5 text-sm text-peach-cream">— [Name], relation · Katy, TX</footer>
        </blockquote>
      </section>

      {/* 7. Insurance strip */}
      <section className="px-4 py-16 text-center md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
            Insurance
          </div>
          <h2 className="mt-2 text-3xl">We accept most major insurance</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-base text-slate">
            <span>Medicare</span>
            <span>Medicaid</span>
            <span>Most private plans</span>
            <span>Private pay</span>
          </div>
          <div className="mt-5 text-sm text-care-blue">
            {/* Phase 3: link to /insurance */}
            See full list of accepted plans →
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="bg-peach-cream px-4 py-20 text-center md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl">Ready to bring care home?</h2>
          <p className="mt-3 text-base text-slate">
            Talk to our intake team today. Most referrals begin care within 48 hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/request-care" size="lg">
              Request Care →
            </Button>
            <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
              Call {siteConfig.phone}
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <TrustBadge>Medicare-certified</TrustBadge>
            <TrustBadge>CHAP-accredited</TrustBadge>
            <TrustBadge>Serving Katy since 2008</TrustBadge>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify homepage renders in dev**

```bash
npm run dev
```

Open http://localhost:3000. Confirm:
- Hero renders with headline "Quality care, felt at home."
- All 8 numbered content sections appear in order with correct styling
- Nav sticks to top, Footer pins to bottom
- Mobile resize works (sections stack, nav collapses to menu)

Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: scaffold homepage with all 10 sections as styled placeholders"
```

---

## Task 14: Set up MDX content pipeline and sample service page

**Files:**
- Create: `content/services/skilled-nursing.mdx`, `app/services/[slug]/page.tsx`, `lib/services.ts`

We use `next-mdx-remote/rsc` for runtime MDX compilation inside Server Components. No `next.config.mjs` changes needed — `next-mdx-remote` handles MDX at render time, not build time.

- [ ] **Step 1: Create lib/services.ts (loads MDX content)**

```ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { services } from "./site-config";

export type ServiceFrontmatter = {
  title: string;
  eyebrow: string;
  heroSubtitle: string;
  coverage: string[];
};

export async function loadService(slug: string) {
  const known = services.find((s) => s.slug === slug);
  if (!known) return null;

  const file = path.join(process.cwd(), "content/services", `${slug}.mdx`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      name: known.name,
      frontmatter: data as ServiceFrontmatter,
      body: content,
    };
  } catch {
    return null;
  }
}

export async function allServiceSlugs() {
  return services.map((s) => ({ slug: s.slug }));
}
```

- [ ] **Step 2: Create content/services/skilled-nursing.mdx**

```mdx
---
title: "Skilled Nursing"
eyebrow: "Services · Skilled Nursing"
heroSubtitle: "Physician-ordered skilled nursing delivered by registered and licensed vocational nurses — covered by Medicare when you qualify."
coverage:
  - "Medicare Part A/B"
  - "Medicaid"
  - "Most private insurance"
  - "Private pay"
---

## What our nurses do at home

- Wound care, dressing changes, catheter care
- Medication management and education
- IV therapy, injections, lab draws
- Post-surgical recovery and monitoring
- Chronic disease management (CHF, COPD, diabetes)
- Patient and family education

## Who qualifies

To receive home health under Medicare, you must be homebound, need skilled care, and have a physician's order. We'll help you verify — no commitment.
```

- [ ] **Step 3: Install @tailwindcss/typography for MDX prose rendering**

```bash
npm install -D @tailwindcss/typography
```

Add to `app/globals.css` at the top (after `@import "tailwindcss";`):

```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 4: Create app/services/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { loadService, allServiceSlugs } from "@/lib/services";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  return allServiceSlugs();
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await loadService(slug);
  if (!service) notFound();

  const { name, frontmatter, body } = service;

  return (
    <>
      {/* Hero */}
      <section className="bg-peach-cream px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
              {frontmatter.eyebrow}
            </div>
            <h1 className="mt-3 text-5xl leading-[1.05]">
              Clinical care, in the comfort of home.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate">
              {frontmatter.heroSubtitle}
            </p>
          </div>
          <div className="aspect-[4/3] rounded-xl bg-white" aria-hidden>
            {/* Phase 2: service-specific watercolor */}
          </div>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[2fr_1fr]">
          <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-navy prose-li:text-slate">
            <MDXRemote source={body} />
          </article>

          <aside>
            <Card variant="mist">
              <h3 className="text-lg">Typical coverage</h3>
              <ul className="mt-3 space-y-1 text-sm text-slate">
                {frontmatter.coverage.map((c) => (
                  <li key={c}>✓ {c}</li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-peach-cream p-3 text-sm">
                Not sure what you&apos;re covered for?{" "}
                <strong>Call {siteConfig.phone}</strong> — we verify in minutes.
              </div>
            </Card>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy px-4 py-16 text-center text-white md:px-6">
        <h2 className="text-3xl text-white">Ready to start {name.toLowerCase()} care?</h2>
        <div className="mt-5">
          <Button href="/request-care" size="lg">Request Care →</Button>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify route works**

```bash
npm run dev
```

Open http://localhost:3000/services/skilled-nursing. Confirm:
- Hero shows "Clinical care, in the comfort of home."
- MDX body renders with proper prose styling: "What our nurses do at home" heading, bulleted list, "Who qualifies" paragraph
- "Typical coverage" sidebar card shows 4 items
- Bottom CTA reads "Ready to start skilled nursing care?"

Visit http://localhost:3000/services/nonexistent — expect 404.

Stop server.

- [ ] **Step 6: Commit**

```bash
git add lib/services.ts content/services/skilled-nursing.mdx app/services/[slug]/page.tsx app/globals.css package.json package-lock.json
git commit -m "feat: add MDX service pages with next-mdx-remote and sample content"
```

---

## Task 15: Add build + a11y smoke test

**Files:**
- Create: `tests/smoke.test.tsx`

- [ ] **Step 1: Create tests/smoke.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import HomePage from "@/app/page";

describe("Homepage smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<HomePage />);
    expect(container).toBeInTheDocument();
    expect(container.textContent).toMatch(/quality care/i);
  });

  it("has no obvious a11y violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

Note: `<HomePage />` renders without the Nav/Footer wrapper because layouts aren't composed in unit render. That's fine — we're smoke-testing the page itself.

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all tests pass (Button + Nav + smoke). If axe reports issues, fix them in the relevant components before committing (most likely: missing `alt=""` or missing landmark roles).

- [ ] **Step 3: Run full build to confirm production compiles**

```bash
npm run build
```

Expected: build succeeds, reports static pages for `/`, `/services/skilled-nursing`.

- [ ] **Step 4: Commit**

```bash
git add tests/smoke.test.tsx
git commit -m "test: add homepage render + a11y smoke test"
```

---

## Task 16: Deploy to Vercel

**Files:**
- Create: `README.md` (if not created by Task 1)

- [ ] **Step 1: Push to GitHub**

Assumes the repo was created per Prerequisites. From the project root:

```bash
git remote -v
```

If no `origin` is set:

```bash
git remote add origin https://github.com/<clint-username>/lifecare-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Connect Vercel to the repo**

This step is done by the user in the Vercel dashboard (not via CLI):

1. Go to https://vercel.com/dashboard → Add New → Project
2. Import the `lifecare-website` GitHub repo
3. Framework preset: Next.js (auto-detected)
4. Environment variables: add `RESEND_API_KEY` (placeholder value OK — used in Phase 2)
5. Deploy

- [ ] **Step 3: Verify deployment**

Open the Vercel-assigned preview URL (e.g., `lifecare-website.vercel.app`). Confirm:
- Homepage renders
- Nav and Footer show
- `/services/skilled-nursing` route works
- Lighthouse Performance score > 85 on mobile

- [ ] **Step 4: Overwrite README.md**

```markdown
# Lifecare Options — Website

Next.js marketing site for Lifecare Options Home Health, Katy TX.

## Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind v4
- shadcn/ui + Radix primitives
- MDX for content
- Framer Motion for subtle motion
- Deployed on Vercel

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # vitest
npm run build    # production build
```

## Deployment

Auto-deploys from `main` branch via Vercel. Preview deploys on every PR.

## Content

Page copy lives in `/content/*.mdx`. Edit markdown, commit, push — Vercel rebuilds.

## Spec

See `docs/superpowers/specs/2026-04-17-lifecare-website-design.md`.
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add project README"
git push
```

---

## Phase 1 Done — Definition of Done

After all tasks are complete, the following must be true:

- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (all 10+ tests green: Button, Nav, smoke + axe)
- [ ] The deployed preview URL loads the homepage with all 10 sections visible
- [ ] Mobile responsive works (nav collapses to menu; sections stack)
- [ ] `/services/skilled-nursing` route renders MDX content
- [ ] Lighthouse Performance score > 85 on mobile preview
- [ ] No console errors or warnings in production build

## What Phase 1 does NOT include (deferred to later phases)

- Watercolor illustrations (Phase 2)
- Real copy for service cards on homepage (Phase 2)
- Other 5 service sub-pages (Phase 2)
- Request Care form logic (Phase 2)
- About, Service Area (with map), Insurance, For Providers, FAQ, Careers, Contact pages (Phase 3)
- Real testimonials, team bios, photography (Phase 4)
- DNS cutover to mylifecareoptions.com (Phase 4)
- Leaflet map implementation (Phase 3)
- 301 redirects from old Wix URLs (Phase 4)
