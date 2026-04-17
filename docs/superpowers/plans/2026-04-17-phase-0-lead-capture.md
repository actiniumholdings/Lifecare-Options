# Lifecare Options Phase 0 — Lead Capture MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed single-page Next.js site on Vercel with two lead-capture forms (Services + Employment) that email submissions to `intake@mylifecareoptions.com`, live on `mylifecareoptions.com` within 5 working days.

**Architecture:** Single `/` route with inline sections (Hero → Trust → About → Services grid → LeadForm → Footer). Forms validate via Zod + react-hook-form, submit to `/api/lead` serverless route, which sends email via Resend. No database. Tailwind v4 + shadcn/ui for primitives. Vitest for tests.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.5 (strict), Tailwind CSS v4, shadcn/ui, Radix UI, Zod 3, react-hook-form 7, Resend, Playfair Display + Inter, Vitest 2 + Testing Library + vitest-axe.

---

## Prerequisites (done by user before Task 1)

- [ ] **Save approved logo icon** at `public/images/logo-icon.png` (from Nano Banana, 2026-04-17). PNG, ~1024×1024, transparent background not required — the rounded navy square is part of the icon.
- [ ] **Create GitHub repo** `lifecare-website` under Clint's account. Push the existing `Lifecare Website/` folder (with `docs/` and `.gitignore`) as initial commit.
- [ ] **Verify `intake@mylifecareoptions.com` mailbox exists** and is monitored. If not, create it before Task 14.
- [ ] **Create Resend account** at resend.com, free tier. Get an API key. Do NOT add the API key anywhere yet — we'll configure it in Vercel env vars in Task 14.

---

## File structure (created during this plan)

```
/app
  layout.tsx                   Root layout (fonts, metadata, Nav + Footer)
  page.tsx                     Single-page site — all sections inline
  globals.css                  Tailwind v4 + design tokens
  api/
    lead/
      route.ts                 POST handler — validate + email via Resend

/components
  Logo.tsx
  Nav.tsx
  Footer.tsx
  Button.tsx
  Card.tsx
  TrustBadge.tsx
  LeadForm.tsx                 Client component — tabs + fields + submit

/lib
  fonts.ts                     next/font config
  site-config.ts               Phone, address, hours, services list
  lead-schema.ts               Zod schemas for both form types + TypeScript types
  send-lead-email.ts           Resend email-delivery helper (isolated for testing)

/public/images
  logo-icon.png                Supplied by user

/tests
  lead-schema.test.ts
  send-lead-email.test.ts
  api-lead.test.ts
  LeadForm.test.tsx
  Button.test.tsx
  Nav.test.tsx
  smoke.test.tsx               Homepage render + axe a11y

Configuration:
  package.json, tsconfig.json, next.config.mjs, postcss.config.mjs,
  vitest.config.ts, tests/setup.ts, eslint.config.mjs, .prettierrc,
  .gitignore, README.md, .env.local.example
```

---

## Task 1: Initialize Next.js 15 project

**Files:**
- Create (via `create-next-app`): `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, etc.

- [ ] **Step 1: Run create-next-app**

From project root (`/Users/clintives/Documents/Claude/Projects/Lifecare Website/`):

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --use-npm
```

Accept prompts. This scaffolds into the current directory alongside existing `docs/` folder.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install zod react-hook-form @hookform/resolvers resend clsx tailwind-merge lucide-react
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest @vitest/ui @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest-axe @types/node prettier prettier-plugin-tailwindcss eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-next
```

- [ ] **Step 4: Force Tailwind v4**

`create-next-app` sometimes scaffolds v3. Force v4:

```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest
npm uninstall autoprefixer 2>/dev/null || true
```

- [ ] **Step 5: Verify baseline works**

```bash
npm run dev
```

Expected: Next.js starts on http://localhost:3000 with the default welcome page. Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 with core dependencies"
```

---

## Task 2: Configure strict TypeScript, ESLint, Prettier

**Files:**
- Modify: `tsconfig.json`, `package.json`
- Create: `eslint.config.mjs`, `.prettierrc`

- [ ] **Step 1: Overwrite tsconfig.json**

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
  { ignores: [".next/**", "node_modules/**", "public/**"] },
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

- [ ] **Step 4: Update package.json scripts**

Replace the `scripts` block:

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

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json eslint.config.mjs .prettierrc package.json
git commit -m "chore: configure strict TypeScript, ESLint, Prettier"
```

---

## Task 3: Tailwind v4 with design tokens + PostCSS

**Files:**
- Delete: `tailwind.config.ts` (if present)
- Create: `postcss.config.mjs`
- Overwrite: `app/globals.css`

- [ ] **Step 1: Remove legacy Tailwind config**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

- [ ] **Step 2: Create postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Overwrite app/globals.css**

```css
@import "tailwindcss";

@theme {
  --color-navy: #0f2b47;
  --color-care-blue: #5a8bb8;
  --color-peach-cream: #fdeedd;
  --color-mist: #f7fafc;
  --color-slate: #6b7d92;
  --color-success-green: #2d6a4f;
  --color-alert-red: #c0392b;
  --color-borderline: #e4ecf3;

  --font-display: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
}

html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  background: #ffffff;
  color: var(--color-navy);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-navy);
  font-weight: 500;
  line-height: 1.1;
}

:focus-visible {
  outline: 2px solid var(--color-care-blue);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Smooth anchor scroll for in-page #contact link */
html { scroll-behavior: smooth; }
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css postcss.config.mjs
git rm -f tailwind.config.ts 2>/dev/null || true
git commit -m "feat: configure Tailwind v4 with design tokens"
```

---

## Task 4: Google Fonts (Playfair Display + Inter)

**Files:**
- Create: `lib/fonts.ts`

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

- [ ] **Step 2: Commit**

```bash
git add lib/fonts.ts
git commit -m "feat: configure Playfair Display + Inter via next/font"
```

---

## Task 5: Site config (single source for contact info)

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
  intakeEmail: "intake@mylifecareoptions.com",
  jobsEmail: "jobs@mylifecareoptions.com",
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
  medicareCcn: "[TBD — fill before launch]",
  stateLicense: "[TBD — fill before launch]",
} as const;

export const services = [
  { name: "Skilled Nursing", description: "Wound care, medication management, chronic disease support." },
  { name: "Physical Therapy", description: "Mobility, strength, balance — post-surgery or progressive." },
  { name: "Occupational Therapy", description: "Daily-living skills — dressing, cooking, bathing, safety." },
  { name: "Speech Therapy", description: "Communication and swallowing — post-stroke and neurological." },
  { name: "Medical Social Work", description: "Benefits navigation, resources, family support." },
  { name: "Home Health Aide", description: "Personal care — bathing, grooming, meal prep, companionship." },
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
git commit -m "feat: add site-config as single source for contact and services"
```

---

## Task 6: Vitest config + setup

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

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

- [ ] **Step 3: Sanity test — create and run a trivial test**

Create `tests/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("sanity", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

```bash
npm test
```

Expected: 1 test passes. Delete `tests/sanity.test.ts` after verifying.

```bash
rm tests/sanity.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/setup.ts
git commit -m "chore: configure Vitest with jsdom + axe"
```

---

## Task 7: Logo component

**Files:**
- Create: `components/Logo.tsx`

**Dependency:** `public/images/logo-icon.png` must exist (prerequisite).

- [ ] **Step 1: Create components/Logo.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
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

Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add components/Logo.tsx
git commit -m "feat: add Logo component"
```

---

## Task 8: Button component with tests

**Files:**
- Create: `components/Button.tsx`, `tests/Button.test.tsx`

- [ ] **Step 1: Write failing test**

`tests/Button.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders primary variant by default with care-blue background", () => {
    render(<Button>Request info</Button>);
    const btn = screen.getByRole("button", { name: /request info/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/bg-care-blue/);
  });

  it("renders secondary variant as outlined", () => {
    render(<Button variant="secondary">Call</Button>);
    expect(screen.getByRole("button").className).toMatch(/border/);
  });

  it("renders as an <a> when href is provided", () => {
    render(<Button href="#contact">Jump</Button>);
    const link = screen.getByRole("link", { name: /jump/i });
    expect(link).toHaveAttribute("href", "#contact");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- Button
```

Expected: FAIL, module not found.

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
  primary: "bg-care-blue text-white hover:bg-[#4a7aa3] rounded-full",
  secondary: "bg-white text-navy border-[1.5px] border-navy hover:bg-mist rounded-full",
  tertiary: "bg-transparent text-care-blue hover:text-navy underline-offset-4 hover:underline",
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
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
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

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- Button
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Button.tsx tests/Button.test.tsx
git commit -m "feat: add Button with primary/secondary/tertiary variants"
```

---

## Task 9: Card and TrustBadge components

**Files:**
- Create: `components/Card.tsx`, `components/TrustBadge.tsx`

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
    <div className={twMerge("rounded-xl p-6", VARIANT[variant], className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create components/TrustBadge.tsx**

```tsx
export function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-medium text-success-green">
      <span aria-hidden>✓</span>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Card.tsx components/TrustBadge.tsx
git commit -m "feat: add Card and TrustBadge display components"
```

---

## Task 10: Nav component with mobile menu + test

**Files:**
- Create: `components/Nav.tsx`, `tests/Nav.test.tsx`

- [ ] **Step 1: Write failing test**

`tests/Nav.test.tsx`:

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

  it("has a Request info CTA anchoring to #contact", () => {
    render(<Nav />);
    const cta = screen.getByRole("link", { name: /request info/i });
    expect(cta).toHaveAttribute("href", "#contact");
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

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- Nav
```

- [ ] **Step 3: Create components/Nav.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig } from "@/lib/site-config";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-borderline bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo size="md" />

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={siteConfig.phoneHref}
            className="text-sm text-navy hover:text-care-blue"
          >
            {siteConfig.phone}
          </Link>
          <Button href="#contact">Request info →</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-borderline bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <Link
              href={siteConfig.phoneHref}
              onClick={() => setOpen(false)}
              className="py-2 text-base text-navy"
            >
              Call {siteConfig.phone}
            </Link>
            <Button href="#contact" size="lg">
              Request info →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- Nav
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx tests/Nav.test.tsx
git commit -m "feat: add Nav with mobile menu and #contact CTA"
```

---

## Task 11: Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create components/Footer.tsx**

```tsx
import Link from "next/link";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy text-[#a8b8cc]">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Contact */}
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

          {/* Hours */}
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

          {/* Accreditation */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
              Accreditation
            </div>
            <div className="space-y-1 text-sm">
              <div>Medicare-certified</div>
              <div>{siteConfig.accreditation}</div>
              <div>Serving Katy since {siteConfig.foundedYear}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} {siteConfig.name} Home Health Services ·
          Equal opportunity employer
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with 3-column contact/hours/accreditation"
```

---

## Task 12: Wire Nav + Footer into root layout

**Files:**
- Overwrite: `app/layout.tsx`

- [ ] **Step 1: Overwrite app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lifecare Options — Home Health in Katy, TX",
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

- [ ] **Step 2: Verify in dev**

```bash
npm run dev
```

Open http://localhost:3000. Confirm Nav at top, Footer at bottom. Default page content (from create-next-app) still shows between them — we replace it in Task 13. Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: wire Nav and Footer into root layout"
```

---

## Task 13: Homepage — static sections (Hero, Trust, About, Services)

**Files:**
- Overwrite: `app/page.tsx`

The LeadForm section is a placeholder in this task — we replace it with a real component in Task 15.

- [ ] **Step 1: Overwrite app/page.tsx**

```tsx
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
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
              <Button href="#contact" size="lg">
                Request info →
              </Button>
              <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </Button>
            </div>
          </div>
          <div
            className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-borderline to-peach-cream"
            aria-hidden
          />
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="border-y border-borderline bg-mist px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="font-display text-xl">Medicare-certified</div>
            <div className="text-xs text-slate">+ {siteConfig.accreditation}</div>
          </div>
          <div>
            <div className="font-display text-xl">Serving Katy since {siteConfig.foundedYear}</div>
            <div className="text-xs text-slate">Locally owned</div>
          </div>
          <div>
            <div className="font-display text-xl">24/7 on-call nursing</div>
            <div className="text-xs text-slate">Always reachable</div>
          </div>
        </div>
      </section>

      {/* 3. About band */}
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-4xl leading-[1.1]">Serving Katy families since 2008.</h2>
            <p className="mt-5 text-base leading-relaxed text-slate">
              Lifecare Options has served Katy families since 2008. We&apos;re a CHAP-accredited,
              Medicare-certified home health agency, locally owned and small enough to know your
              name. Our clinicians bring skilled care into the home — where healing is most natural —
              and we&apos;re on-call 24/7 for whatever comes next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TrustBadge>Medicare-certified</TrustBadge>
            <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            <TrustBadge>Serving Katy since {siteConfig.foundedYear}</TrustBadge>
            <TrustBadge>24/7 on-call</TrustBadge>
          </div>
        </div>
      </section>

      {/* 4. Services at a glance */}
      <section className="bg-mist px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-care-blue">
              Our services
            </div>
            <h2 className="mt-2 text-4xl leading-[1.1]">
              Six disciplines, one coordinated plan
            </h2>
            <p className="mt-3 text-base text-slate">
              Physician-ordered home health covered by Medicare. Our team works together around your
              care plan — no handoff gaps.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {services.map((s, i) => {
              const variant = i % 3 === 0 ? "peach" : i % 3 === 1 ? "white" : "mist";
              return (
                <Card key={s.name} variant={variant}>
                  <div className="font-display text-xl">{s.name}</div>
                  <div className="mt-2 text-sm text-slate">{s.description}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact / Lead form (placeholder — replaced in Task 15) */}
      <section id="contact" className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl">Get in touch</h2>
          <p className="mt-3 text-slate">Form goes here — added in Task 15.</p>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify visual**

```bash
npm run dev
```

Open http://localhost:3000. Confirm all 5 sections render, Nav "Request info" button scrolls smoothly to `#contact`. Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build homepage static sections (hero, trust, about, services)"
```

---

## Task 14: Zod schemas for lead forms

**Files:**
- Create: `lib/lead-schema.ts`, `tests/lead-schema.test.ts`

- [ ] **Step 1: Write failing test**

`tests/lead-schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { servicesLeadSchema, employmentLeadSchema, leadSchema } from "@/lib/lead-schema";

describe("servicesLeadSchema", () => {
  it("accepts a valid submission", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Jane Doe",
      phone: "(281) 555-0100",
      email: "jane@example.com",
      careFor: "family",
      servicesInterested: ["skilled-nursing", "physical-therapy"],
      insurance: "medicare",
      timeline: "asap",
      message: "Need help with my mom after her hip surgery.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "",
      phone: "",
      email: "",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects bad email format", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "not-an-email",
      careFor: "self",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when honeypot website field is filled", () => {
    const result = servicesLeadSchema.safeParse({
      type: "services",
      name: "Bot",
      phone: "2815550100",
      email: "bot@bot.com",
      careFor: "self",
      website: "http://spam.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("employmentLeadSchema", () => {
  it("accepts a valid submission", () => {
    const result = employmentLeadSchema.safeParse({
      type: "employment",
      name: "Maria Lopez",
      phone: "(281) 555-0200",
      email: "maria@example.com",
      position: "rn",
      yearsExperience: "5-10",
      license: "RN license #12345",
      message: "Available weekends.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required position", () => {
    const result = employmentLeadSchema.safeParse({
      type: "employment",
      name: "Maria",
      phone: "2815550200",
      email: "maria@example.com",
      website: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("leadSchema (discriminated union)", () => {
  it("routes by type", () => {
    const services = leadSchema.safeParse({
      type: "services",
      name: "A",
      phone: "2815550100",
      email: "a@a.com",
      careFor: "self",
      website: "",
    });
    expect(services.success).toBe(true);

    const employment = leadSchema.safeParse({
      type: "employment",
      name: "B",
      phone: "2815550100",
      email: "b@b.com",
      position: "hha",
      yearsExperience: "1-3",
      website: "",
    });
    expect(employment.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- lead-schema
```

- [ ] **Step 3: Create lib/lead-schema.ts**

```ts
import { z } from "zod";

const baseFields = {
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(200),
  message: z.string().trim().max(500).optional().default(""),
  website: z.literal("").describe("Honeypot — must be empty"),
};

export const servicesLeadSchema = z.object({
  type: z.literal("services"),
  ...baseFields,
  careFor: z.enum(["self", "family", "referring"], {
    required_error: "Please tell us who the care is for",
  }),
  servicesInterested: z
    .array(
      z.enum([
        "skilled-nursing",
        "physical-therapy",
        "occupational-therapy",
        "speech-therapy",
        "medical-social-work",
        "home-health-aide",
        "not-sure",
      ])
    )
    .optional()
    .default([]),
  insurance: z
    .enum(["medicare", "medicaid", "private", "private-pay", "not-sure"])
    .optional(),
  timeline: z.enum(["asap", "2-weeks", "month", "researching"]).optional(),
});

export const employmentLeadSchema = z.object({
  type: z.literal("employment"),
  ...baseFields,
  position: z.enum(["rn", "lvn", "hha", "caregiver", "other"], {
    required_error: "Please select a position",
  }),
  yearsExperience: z.enum(["lt1", "1-3", "3-5", "5-10", "10plus"], {
    required_error: "Please select years of experience",
  }),
  license: z.string().trim().max(200).optional().default(""),
});

export const leadSchema = z.discriminatedUnion("type", [
  servicesLeadSchema,
  employmentLeadSchema,
]);

export type ServicesLead = z.infer<typeof servicesLeadSchema>;
export type EmploymentLead = z.infer<typeof employmentLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- lead-schema
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/lead-schema.ts tests/lead-schema.test.ts
git commit -m "feat: add Zod schemas for services and employment lead forms"
```

---

## Task 15: LeadForm component with tab toggle

**Files:**
- Create: `components/LeadForm.tsx`, `tests/LeadForm.test.tsx`
- Modify: `app/page.tsx` (replace placeholder with `<LeadForm />`)

- [ ] **Step 1: Write failing test**

`tests/LeadForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { LeadForm } from "@/components/LeadForm";

describe("LeadForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      } as Response)
    );
  });

  it("renders services tab by default", () => {
    render(<LeadForm />);
    expect(screen.getByRole("tab", { name: /services inquiry/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByLabelText(/who is the care for/i)).toBeInTheDocument();
  });

  it("switches to employment tab and shows employment fields", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("tab", { name: /work with us/i }));
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting empty services form", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.click(screen.getByRole("button", { name: /request info/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
  });

  it("submits valid services form and shows thank-you", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/phone/i), "(281) 555-0100");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByLabelText(/family member/i));
    await user.click(screen.getByRole("button", { name: /request info/i }));

    expect(await screen.findByText(/thanks — we got it/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/lead",
      expect.objectContaining({ method: "POST" })
    );
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- LeadForm
```

- [ ] **Step 3: Create components/LeadForm.tsx**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  servicesLeadSchema,
  employmentLeadSchema,
  type ServicesLead,
  type EmploymentLead,
} from "@/lib/lead-schema";
import { Button } from "./Button";

type Tab = "services" | "employment";

const SERVICE_OPTIONS = [
  { value: "skilled-nursing", label: "Skilled Nursing" },
  { value: "physical-therapy", label: "Physical Therapy" },
  { value: "occupational-therapy", label: "Occupational Therapy" },
  { value: "speech-therapy", label: "Speech Therapy" },
  { value: "medical-social-work", label: "Medical Social Work" },
  { value: "home-health-aide", label: "Home Health Aide" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const inputClass =
  "w-full rounded-lg border border-borderline bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-care-blue/40";
const labelClass = "block text-sm font-medium text-navy";
const errorClass = "mt-1 text-xs text-alert-red";

export function LeadForm() {
  const [tab, setTab] = useState<Tab>("services");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  if (submitState === "ok") {
    return (
      <div className="mx-auto max-w-xl rounded-xl bg-peach-cream p-8 text-center">
        <h3 className="font-display text-2xl">Thanks — we got it.</h3>
        <p className="mt-3 text-sm text-slate">
          {tab === "services"
            ? "Our intake team will reach out within 1 business day."
            : "Please email your resume to jobs@mylifecareoptions.com — we'll be in touch within 2 business days."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div
        role="tablist"
        aria-label="Form type"
        className="flex gap-2 border-b border-borderline"
      >
        <button
          role="tab"
          aria-selected={tab === "services"}
          onClick={() => setTab("services")}
          className={`px-4 py-3 text-sm font-medium ${
            tab === "services"
              ? "border-b-2 border-care-blue text-navy"
              : "text-slate hover:text-navy"
          }`}
        >
          Services inquiry
        </button>
        <button
          role="tab"
          aria-selected={tab === "employment"}
          onClick={() => setTab("employment")}
          className={`px-4 py-3 text-sm font-medium ${
            tab === "employment"
              ? "border-b-2 border-care-blue text-navy"
              : "text-slate hover:text-navy"
          }`}
        >
          Work with us
        </button>
      </div>

      <div className="mt-6">
        {tab === "services" ? (
          <ServicesFormFields
            onSuccess={() => setSubmitState("ok")}
            onError={() => setSubmitState("error")}
            onSubmitting={() => setSubmitState("submitting")}
            isSubmitting={submitState === "submitting"}
          />
        ) : (
          <EmploymentFormFields
            onSuccess={() => setSubmitState("ok")}
            onError={() => setSubmitState("error")}
            onSubmitting={() => setSubmitState("submitting")}
            isSubmitting={submitState === "submitting"}
          />
        )}
        {submitState === "error" && (
          <p className="mt-3 text-sm text-alert-red">
            Something went wrong. Please try again or call {`(281) 646-9546`}.
          </p>
        )}
      </div>
    </div>
  );
}

type FormHandlers = {
  onSuccess: () => void;
  onError: () => void;
  onSubmitting: () => void;
  isSubmitting: boolean;
};

function ServicesFormFields({ onSuccess, onError, onSubmitting, isSubmitting }: FormHandlers) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicesLead>({
    resolver: zodResolver(servicesLeadSchema),
    defaultValues: { type: "services", website: "", servicesInterested: [] },
  });

  const onSubmit = async (data: ServicesLead) => {
    onSubmitting();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      onError();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("type")} />
      {/* Honeypot — must remain empty */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="svc-name" className={labelClass}>Full name *</label>
        <input id="svc-name" type="text" className={inputClass} {...register("name")} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="svc-phone" className={labelClass}>Phone *</label>
          <input id="svc-phone" type="tel" className={inputClass} {...register("phone")} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="svc-email" className={labelClass}>Email *</label>
          <input id="svc-email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Who is the care for? *</legend>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="self" {...register("careFor")} /> Myself
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="family" {...register("careFor")} /> Family member
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="referring" {...register("careFor")} /> Patient I&apos;m referring
          </label>
        </div>
        {errors.careFor && <p className={errorClass}>{errors.careFor.message}</p>}
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Services of interest</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {SERVICE_OPTIONS.map((s) => (
            <label key={s.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={s.value} {...register("servicesInterested")} /> {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="svc-insurance" className={labelClass}>Insurance</label>
          <select id="svc-insurance" className={inputClass} {...register("insurance")}>
            <option value="">Select…</option>
            <option value="medicare">Medicare</option>
            <option value="medicaid">Medicaid</option>
            <option value="private">Private insurance</option>
            <option value="private-pay">Private pay</option>
            <option value="not-sure">Not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor="svc-timeline" className={labelClass}>Timeline</label>
          <select id="svc-timeline" className={inputClass} {...register("timeline")}>
            <option value="">Select…</option>
            <option value="asap">ASAP</option>
            <option value="2-weeks">Within 2 weeks</option>
            <option value="month">Within a month</option>
            <option value="researching">Just researching</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="svc-message" className={labelClass}>Message</label>
        <textarea
          id="svc-message"
          rows={4}
          maxLength={500}
          className={inputClass}
          {...register("message")}
        />
      </div>

      <Button size="lg">{isSubmitting ? "Sending…" : "Request info →"}</Button>
    </form>
  );
}

function EmploymentFormFields({ onSuccess, onError, onSubmitting, isSubmitting }: FormHandlers) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmploymentLead>({
    resolver: zodResolver(employmentLeadSchema),
    defaultValues: { type: "employment", website: "" },
  });

  const onSubmit = async (data: EmploymentLead) => {
    onSubmitting();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      onError();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("type")} />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="emp-name" className={labelClass}>Full name *</label>
        <input id="emp-name" type="text" className={inputClass} {...register("name")} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="emp-phone" className={labelClass}>Phone *</label>
          <input id="emp-phone" type="tel" className={inputClass} {...register("phone")} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="emp-email" className={labelClass}>Email *</label>
          <input id="emp-email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="emp-position" className={labelClass}>Position *</label>
          <select id="emp-position" className={inputClass} {...register("position")}>
            <option value="">Select…</option>
            <option value="rn">Registered Nurse (RN)</option>
            <option value="lvn">Licensed Vocational Nurse (LVN)</option>
            <option value="hha">Home Health Aide (HHA)</option>
            <option value="caregiver">Caregiver</option>
            <option value="other">Other</option>
          </select>
          {errors.position && <p className={errorClass}>{errors.position.message}</p>}
        </div>
        <div>
          <label htmlFor="emp-years" className={labelClass}>Years of experience *</label>
          <select id="emp-years" className={inputClass} {...register("yearsExperience")}>
            <option value="">Select…</option>
            <option value="lt1">Less than 1 year</option>
            <option value="1-3">1–3 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5-10">5–10 years</option>
            <option value="10plus">10+ years</option>
          </select>
          {errors.yearsExperience && (
            <p className={errorClass}>{errors.yearsExperience.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="emp-license" className={labelClass}>Texas license / certification</label>
        <input
          id="emp-license"
          type="text"
          placeholder="e.g. RN license #12345"
          className={inputClass}
          {...register("license")}
        />
      </div>

      <div>
        <label htmlFor="emp-message" className={labelClass}>Message</label>
        <textarea
          id="emp-message"
          rows={4}
          maxLength={500}
          className={inputClass}
          {...register("message")}
        />
      </div>

      <Button size="lg">{isSubmitting ? "Sending…" : "Submit inquiry →"}</Button>
    </form>
  );
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- LeadForm
```

Expected: all 4 tests pass.

- [ ] **Step 5: Replace placeholder in app/page.tsx**

In `app/page.tsx`, replace the placeholder section (the one with `id="contact"`) with:

```tsx
      {/* 5. Contact / Lead form */}
      <section id="contact" className="bg-white px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-4xl">Get in touch</h2>
            <p className="mt-3 text-slate">
              Fill out the form below and our team will reach out within 1 business day.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
```

Add at the top of `app/page.tsx`:

```tsx
import { LeadForm } from "@/components/LeadForm";
```

- [ ] **Step 6: Verify in dev**

```bash
npm run dev
```

Open http://localhost:3000. Scroll to Contact section. Toggle between tabs. Try submitting empty — see validation errors. Fill valid data and submit — observe submission attempt (will fail with 404 because `/api/lead` doesn't exist yet — that's expected, we build it in Task 16). Stop server.

- [ ] **Step 7: Commit**

```bash
git add components/LeadForm.tsx tests/LeadForm.test.tsx app/page.tsx
git commit -m "feat: add LeadForm with tabs, react-hook-form, Zod validation"
```

---

## Task 16: Resend email helper

**Files:**
- Create: `lib/send-lead-email.ts`, `tests/send-lead-email.test.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Write failing test**

`tests/send-lead-email.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendLeadEmail } from "@/lib/send-lead-email";
import type { Lead } from "@/lib/lead-schema";

const mockSend = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}));

describe("sendLeadEmail", () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ data: { id: "abc" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
  });

  it("sends a Services email with [Services] subject prefix", async () => {
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "family",
      servicesInterested: [],
      message: "",
      website: "",
    };
    await sendLeadEmail(lead);
    expect(mockSend).toHaveBeenCalledOnce();
    expect(mockSend.mock.calls[0][0].subject).toMatch(/^\[Services\]/);
    expect(mockSend.mock.calls[0][0].subject).toContain("Jane");
  });

  it("sends an Employment email with [Employment] subject prefix", async () => {
    const lead: Lead = {
      type: "employment",
      name: "Maria",
      phone: "2815550200",
      email: "maria@example.com",
      position: "rn",
      yearsExperience: "5-10",
      license: "",
      message: "",
      website: "",
    };
    await sendLeadEmail(lead);
    expect(mockSend.mock.calls[0][0].subject).toMatch(/^\[Employment\]/);
  });

  it("includes the full payload in the email body", async () => {
    const lead: Lead = {
      type: "services",
      name: "Jane",
      phone: "2815550100",
      email: "jane@example.com",
      careFor: "self",
      servicesInterested: ["skilled-nursing"],
      insurance: "medicare",
      timeline: "asap",
      message: "Need help.",
      website: "",
    };
    await sendLeadEmail(lead);
    const body = mockSend.mock.calls[0][0].text;
    expect(body).toContain("skilled-nursing");
    expect(body).toContain("medicare");
    expect(body).toContain("asap");
    expect(body).toContain("Need help.");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- send-lead-email
```

- [ ] **Step 3: Create lib/send-lead-email.ts**

```ts
import { Resend } from "resend";
import type { Lead } from "./lead-schema";
import { siteConfig } from "./site-config";

// Default to Resend's sandbox sender until the production domain is DNS-verified.
// After Resend domain verification (Task 19 Step 4), set RESEND_FROM in Vercel env
// to "Lifecare Options <no-reply@mylifecareoptions.com>".
const FROM_ADDRESS =
  process.env.RESEND_FROM ?? "Lifecare Options <onboarding@resend.dev>";

function formatBody(lead: Lead): string {
  const lines: string[] = [];
  lines.push(`Type: ${lead.type}`);
  lines.push(`Name: ${lead.name}`);
  lines.push(`Phone: ${lead.phone}`);
  lines.push(`Email: ${lead.email}`);

  if (lead.type === "services") {
    lines.push(`Care for: ${lead.careFor}`);
    if (lead.servicesInterested && lead.servicesInterested.length > 0) {
      lines.push(`Services interested: ${lead.servicesInterested.join(", ")}`);
    }
    if (lead.insurance) lines.push(`Insurance: ${lead.insurance}`);
    if (lead.timeline) lines.push(`Timeline: ${lead.timeline}`);
  } else {
    lines.push(`Position: ${lead.position}`);
    lines.push(`Years of experience: ${lead.yearsExperience}`);
    if (lead.license) lines.push(`License / certification: ${lead.license}`);
  }

  if (lead.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(lead.message);
  }

  return lines.join("\n");
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const resend = new Resend(apiKey);

  const prefix = lead.type === "services" ? "Services" : "Employment";
  const subject = `[${prefix}] New inquiry from ${lead.name}`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: siteConfig.intakeEmail,
    replyTo: lead.email,
    subject,
    text: formatBody(lead),
  });

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}
```

- [ ] **Step 4: Create .env.local.example**

```
# Copy to .env.local and fill in real values
RESEND_API_KEY=re_your_key_here

# Optional — once Resend domain verification is complete (post-launch),
# set this to send from your own domain:
# RESEND_FROM="Lifecare Options <no-reply@mylifecareoptions.com>"
```

Also add `.env.local` to `.gitignore` if not already there:

```bash
grep -q "^\.env\.local$" .gitignore || echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Run — expect pass**

```bash
npm test -- send-lead-email
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/send-lead-email.ts tests/send-lead-email.test.ts .env.local.example .gitignore
git commit -m "feat: add Resend email helper with subject-prefixed bodies"
```

---

## Task 17: /api/lead route handler

**Files:**
- Create: `app/api/lead/route.ts`, `tests/api-lead.test.ts`

- [ ] **Step 1: Write failing test**

`tests/api-lead.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/lead/route";

vi.mock("@/lib/send-lead-email", () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(undefined),
}));

import { sendLeadEmail } from "@/lib/send-lead-email";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/lead", () => {
  beforeEach(() => {
    vi.mocked(sendLeadEmail).mockClear();
  });

  it("returns 200 and sends email for a valid services submission", async () => {
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Jane",
        phone: "2815550100",
        email: "jane@example.com",
        careFor: "self",
        website: "",
      })
    );
    expect(res.status).toBe(200);
    expect(sendLeadEmail).toHaveBeenCalledOnce();
  });

  it("returns 200 for a valid employment submission", async () => {
    const res = await POST(
      makeRequest({
        type: "employment",
        name: "Maria",
        phone: "2815550200",
        email: "maria@example.com",
        position: "rn",
        yearsExperience: "5-10",
        website: "",
      })
    );
    expect(res.status).toBe(200);
    expect(sendLeadEmail).toHaveBeenCalledOnce();
  });

  it("returns 400 for invalid submission", async () => {
    const res = await POST(
      makeRequest({ type: "services", name: "", phone: "", email: "", website: "" })
    );
    expect(res.status).toBe(400);
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Bot",
        phone: "2815550100",
        email: "bot@bot.com",
        careFor: "self",
        website: "http://spam.com",
      })
    );
    expect(res.status).toBe(200); // Return 200 so bots don't know they're caught
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });

  it("returns 500 if email delivery fails", async () => {
    vi.mocked(sendLeadEmail).mockRejectedValueOnce(new Error("resend down"));
    const res = await POST(
      makeRequest({
        type: "services",
        name: "Jane",
        phone: "2815550100",
        email: "jane@example.com",
        careFor: "self",
        website: "",
      })
    );
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm test -- api-lead
```

- [ ] **Step 3: Create app/api/lead/route.ts**

```ts
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { sendLeadEmail } from "@/lib/send-lead-email";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: if the "website" field is non-empty, it's a bot.
  // Return 200 so bots don't learn they were detected.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (body as { website: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await sendLeadEmail(parsed.data);
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Email delivery failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- api-lead
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/lead/route.ts tests/api-lead.test.ts
git commit -m "feat: add /api/lead POST handler with honeypot + validation"
```

---

## Task 18: End-to-end homepage smoke + a11y

**Files:**
- Create: `tests/smoke.test.tsx`

- [ ] **Step 1: Create tests/smoke.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import HomePage from "@/app/page";

describe("Homepage smoke", () => {
  it("renders hero, trust strip, about, services, and contact form", () => {
    const { container } = render(<HomePage />);
    expect(container.textContent).toMatch(/quality care/i);
    expect(container.textContent).toMatch(/medicare-certified/i);
    expect(container.textContent).toMatch(/get in touch/i);
    // LeadForm is client-side but renders on SSR; tabs should be present
    expect(container.textContent).toMatch(/services inquiry/i);
    expect(container.textContent).toMatch(/work with us/i);
  });

  it("has no axe-detected a11y violations on initial render", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run full test suite**

```bash
npm test
```

Expected: **all tests pass** (Button, Nav, LeadForm, lead-schema, send-lead-email, api-lead, smoke). If axe reports issues, fix them in the relevant components before committing.

- [ ] **Step 3: Run full build**

```bash
npm run build
```

Expected: build succeeds. Reports one static page at `/` and one API route at `/api/lead`.

- [ ] **Step 4: Commit**

```bash
git add tests/smoke.test.tsx
git commit -m "test: add homepage smoke + a11y test"
```

---

## Task 19: Deploy to Vercel + DNS cutover

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Push to GitHub**

```bash
git remote -v
```

If no `origin`:

```bash
git remote add origin https://github.com/<clint-username>/lifecare-website.git
git branch -M main
git push -u origin main
```

If origin exists, just:

```bash
git push
```

- [ ] **Step 2: Create Vercel project (done by user in Vercel dashboard)**

1. Go to https://vercel.com/dashboard → Add New → Project
2. Import the `lifecare-website` repo
3. Framework preset: Next.js (auto-detected)
4. **Environment variables:** add `RESEND_API_KEY` with the real Resend API key
5. Deploy

- [ ] **Step 3: Verify Vercel preview**

Open the Vercel-assigned preview URL (e.g., `lifecare-website.vercel.app`).

Smoke checklist:
- [ ] Homepage renders with all 5 sections
- [ ] Nav "Request info" scrolls to form
- [ ] Both tabs (Services / Work with us) work
- [ ] Submitting an empty form shows inline errors
- [ ] Submitting a valid form shows the thank-you state
- [ ] Mobile view (resize to 375px): nav collapses, sections stack, form is usable
- [ ] Lighthouse Performance > 90 on mobile (Chrome DevTools)
- [ ] No console errors

Test an actual email delivery: fill and submit the Services form with your real email. Confirm:
- [ ] Email arrives at `intake@mylifecareoptions.com` within 60 seconds
- [ ] Subject line starts with `[Services]`
- [ ] Body contains all submitted fields
- [ ] Reply-to address is the user's email

Repeat for Employment submission.

- [ ] **Step 4: Configure Resend domain verification (user action)**

Resend requires DNS records to send from `mylifecareoptions.com`:
1. In Resend dashboard, add domain `mylifecareoptions.com`
2. Resend provides 3 DNS records (SPF, DKIM, MX). Add these to DNS (Wix DNS settings or wherever DNS is managed).
3. Wait 5–30 min for verification.
4. Once verified, set `RESEND_FROM="Lifecare Options <no-reply@mylifecareoptions.com>"` in Vercel environment variables and redeploy. Until verified, the code falls back to `onboarding@resend.dev` (Resend sandbox) and emails still deliver — just from a generic sender.

- [ ] **Step 5: DNS cutover from Wix (user action)**

Only do this step when the Vercel preview is fully verified.

1. In Vercel project settings → Domains, add `mylifecareoptions.com` and `www.mylifecareoptions.com`
2. Vercel shows required DNS records (usually A record `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for www)
3. Log into the Wix DNS control panel for `mylifecareoptions.com`
4. Update A record and www CNAME to Vercel's values
5. Wait 5–60 min for DNS propagation
6. Visit https://www.mylifecareoptions.com — confirm Vercel deploy loads (not old Wix site)
7. Vercel auto-provisions SSL certificate

- [ ] **Step 6: Overwrite README.md**

```markdown
# Lifecare Options — Website

Single-page Next.js lead-capture site for Lifecare Options Home Health, Katy TX.

## Stack

- Next.js 15 (App Router) on Vercel
- TypeScript + Tailwind v4
- react-hook-form + Zod validation
- Resend for email delivery
- No database — form submissions are emails

## Development

```bash
cp .env.local.example .env.local  # then fill in RESEND_API_KEY
npm install
npm run dev      # http://localhost:3000
npm run test     # full test suite
npm run build    # production build
```

## Environment variables

- `RESEND_API_KEY` — Resend API key. Create at resend.com.

## Deployment

Auto-deploys from `main` branch via Vercel. Preview deploys on every PR.

## Forms

Two forms live on the homepage (`#contact`), selectable via tabs:
- **Services inquiry** — families / referral sources
- **Work with us** — prospective employees

Both submit to `/api/lead`, validated server-side with the Zod schema in `lib/lead-schema.ts`, and emailed via Resend to the address in `siteConfig.intakeEmail`. Subject lines are prefixed `[Services]` or `[Employment]` for filtering.

## Specs

- Phase 0 (current): `docs/superpowers/specs/2026-04-17-phase-0-lead-capture-design.md`
- Full site (deferred): `docs/superpowers/specs/2026-04-17-lifecare-website-design.md`
```

- [ ] **Step 7: Commit + push**

```bash
git add README.md
git commit -m "docs: add README with stack + deployment instructions"
git push
```

---

## Phase 0 Done — Definition of Done

- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (all ~20 tests green)
- [ ] Site is live at https://www.mylifecareoptions.com
- [ ] Both forms submit successfully and email arrives at `intake@mylifecareoptions.com`
- [ ] Subject-line prefixes work (`[Services]` / `[Employment]`)
- [ ] Mobile responsive verified at 375px width
- [ ] Lighthouse Performance > 90 on mobile
- [ ] No console errors or warnings in production
- [ ] Medicare CCN + TX state license filled into `lib/site-config.ts` before launch (footer)
- [ ] Resend domain verified (sending from `@mylifecareoptions.com`)

## What Phase 0 does NOT include (deferred to Phase 1+)

- Service sub-pages
- About, Service Area, Insurance, For Providers, FAQ, Careers as dedicated pages
- Watercolor illustrations
- Interactive service area map
- Multi-step Request Care form with progress indicator
- Resume upload on employment form
- Rate limiting / CAPTCHA on lead form
- Blog, patient portal, analytics beyond Vercel's defaults
