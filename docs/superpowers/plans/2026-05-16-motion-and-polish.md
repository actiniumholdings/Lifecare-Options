# Motion + Polish Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a tasteful Framer Motion + UI polish layer to the existing Phase 0 site without layout rewrites — scroll-reveal entrances, soft-spring hover lifts, scroll-aware nav, Phosphor duotone icons on trust strip + services, real Unsplash hero photo. Personality: warm + personable. `prefers-reduced-motion` honored throughout.

**Architecture:** Single shared motion module (`lib/motion.ts` + `lib/use-reduced-motion-safe.ts`) exposes easing tokens and a reduced-motion hook. Three reusable primitives in `components/motion/` (`FadeUp`, `Stagger`/`StaggerItem`, `HoverLift`) wrap Framer Motion's API so animation configs aren't scattered through the codebase. Existing components (`Button`, `TrustBadge`) become `motion(...)` versions. Existing page sections (`app/page.tsx`) consume primitives and Phosphor icons.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind v4, Framer Motion 12 (already installed, import path `motion/react`), Phosphor Icons React (new dep), Vitest 4 + Testing Library + vitest-axe.

**Spec:** [`docs/superpowers/specs/2026-05-16-motion-and-polish-design.md`](../specs/2026-05-16-motion-and-polish-design.md)

**File Structure:**

New files:
- `lib/motion.ts` — easing/spring tokens (constants only, no test)
- `lib/use-reduced-motion-safe.ts` — wrapper hook
- `components/motion/FadeUp.tsx` — fade + slide-up primitive
- `components/motion/Stagger.tsx` — exports `Stagger` parent + `StaggerItem` child
- `components/motion/HoverLift.tsx` — hover lift primitive
- `tests/reduced-motion.test.tsx` — smoke test for reduced-motion content visibility

Modified files:
- `package.json` — add `@phosphor-icons/react`
- `lib/site-config.ts` — add `iconName` field per service
- `app/page.tsx` — convert to client component, wire all motion + icons
- `components/Nav.tsx` — scroll-aware state
- `components/Button.tsx` — motion conversion + tap scale
- `components/TrustBadge.tsx` — motion.span + hover

Unchanged: `components/Footer.tsx`, `components/LeadForm.tsx`, `components/Card.tsx`, `components/Logo.tsx`, `lib/lead-schema.ts`, `lib/send-lead-email.ts`, `app/api/lead/route.ts`, `app/layout.tsx`, `app/globals.css`.

---

## Task 1: Add Phosphor Icons dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (auto-generated)

- [ ] **Step 1: Install the dependency**

Run from project root:

```bash
npm install @phosphor-icons/react@^2.1.7
```

- [ ] **Step 2: Verify install succeeded**

Run:

```bash
npm ls @phosphor-icons/react
```

Expected output includes a line like `@phosphor-icons/react@2.x.x`.

- [ ] **Step 3: Verify typecheck still clean**

Run:

```bash
npm run typecheck
```

Expected: exits 0, no errors.

- [ ] **Step 4: Verify existing tests still pass**

Run:

```bash
npm test
```

Expected: all existing tests pass (no regression).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @phosphor-icons/react dependency"
```

---

## Task 2: Motion easing tokens (`lib/motion.ts`)

Pure constants — no unit test (would just assert literals against themselves). TypeScript inference catches misuse.

**Files:**
- Create: `lib/motion.ts`

- [ ] **Step 1: Create the file**

Write to `lib/motion.ts`:

```ts
import type { Transition } from "motion/react";

export const softSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
};

export const easeOut: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const quickTap: Transition = {
  duration: 0.15,
  ease: "easeOut",
};

export const staggerChildren = 0.08;
```

- [ ] **Step 2: Verify typecheck passes**

Run:

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add lib/motion.ts
git commit -m "feat(motion): add shared easing/spring tokens"
```

---

## Task 3: `useReducedMotionSafe` hook

**Files:**
- Create: `lib/use-reduced-motion-safe.ts`
- Create: `tests/use-reduced-motion-safe.test.tsx`

- [ ] **Step 1: Write the failing test**

Write to `tests/use-reduced-motion-safe.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

// Mock Framer Motion's useReducedMotion so we can control its return value.
const mockUseReducedMotion = vi.fn();
vi.mock("motion/react", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe("useReducedMotionSafe", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReset();
  });

  it("returns true when user prefers reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(true);
  });

  it("returns false when user does not prefer reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(false);
  });

  it("returns false when underlying hook returns null (SSR safety)", () => {
    mockUseReducedMotion.mockReturnValue(null);
    const { result } = renderHook(() => useReducedMotionSafe());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- use-reduced-motion-safe
```

Expected: FAIL with "Failed to resolve import '@/lib/use-reduced-motion-safe'".

- [ ] **Step 3: Write the implementation**

Write to `lib/use-reduced-motion-safe.ts`:

```ts
import { useReducedMotion } from "motion/react";

/**
 * Single source of truth for reduced-motion preference across the app.
 * Wraps Framer's useReducedMotion (which can return null during SSR) so
 * callers get a strict boolean.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() === true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- use-reduced-motion-safe
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/use-reduced-motion-safe.ts tests/use-reduced-motion-safe.test.tsx
git commit -m "feat(motion): add useReducedMotionSafe hook"
```

---

## Task 4: `<FadeUp>` primitive

**Files:**
- Create: `components/motion/FadeUp.tsx`
- Create: `tests/FadeUp.test.tsx`

- [ ] **Step 1: Write the failing test**

Write to `tests/FadeUp.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FadeUp } from "@/components/motion/FadeUp";

describe("FadeUp", () => {
  it("renders its children", () => {
    render(
      <FadeUp>
        <h1>Hello</h1>
      </FadeUp>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts an optional delay prop without throwing", () => {
    render(
      <FadeUp delay={200}>
        <p>Delayed</p>
      </FadeUp>
    );
    expect(screen.getByText("Delayed")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- FadeUp
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Write to `components/motion/FadeUp.tsx`:

```tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type FadeUpProps = {
  children: ReactNode;
  delay?: number; // milliseconds
  className?: string;
};

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...easeOut, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- FadeUp
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/motion/FadeUp.tsx tests/FadeUp.test.tsx
git commit -m "feat(motion): add FadeUp primitive"
```

---

## Task 5: `<Stagger>` + `<StaggerItem>` primitives

**Files:**
- Create: `components/motion/Stagger.tsx`
- Create: `tests/Stagger.test.tsx`

- [ ] **Step 1: Write the failing test**

Write to `tests/Stagger.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

describe("Stagger", () => {
  it("renders all StaggerItem children", () => {
    render(
      <Stagger>
        <StaggerItem>One</StaggerItem>
        <StaggerItem>Two</StaggerItem>
        <StaggerItem>Three</StaggerItem>
      </Stagger>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("forwards an optional className to the parent wrapper", () => {
    const { container } = render(
      <Stagger className="custom-grid">
        <StaggerItem>A</StaggerItem>
      </Stagger>
    );
    expect(container.firstChild).toHaveClass("custom-grid");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- Stagger
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Write to `components/motion/Stagger.tsx`:

```tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, Variants } from "motion/react";
import { softSpring, staggerChildren } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

const parentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: softSpring },
};

export function Stagger({ children, className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={parentVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- Stagger
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/motion/Stagger.tsx tests/Stagger.test.tsx
git commit -m "feat(motion): add Stagger and StaggerItem primitives"
```

---

## Task 6: `<HoverLift>` primitive

**Files:**
- Create: `components/motion/HoverLift.tsx`
- Create: `tests/HoverLift.test.tsx`

- [ ] **Step 1: Write the failing test**

Write to `tests/HoverLift.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HoverLift } from "@/components/motion/HoverLift";

describe("HoverLift", () => {
  it("renders its children", () => {
    render(
      <HoverLift>
        <article>Card content</article>
      </HoverLift>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("forwards className to the wrapper", () => {
    const { container } = render(
      <HoverLift className="wrap-me">
        <span>X</span>
      </HoverLift>
    );
    expect(container.firstChild).toHaveClass("wrap-me");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- HoverLift
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Write the implementation**

Write to `components/motion/HoverLift.tsx`:

```tsx
"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15, 43, 71, 0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={softSpring}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npm test -- HoverLift
```

Expected: 2 tests pass.

- [ ] **Step 5: Verify full test suite still passes**

Run:

```bash
npm test
```

Expected: all tests pass (no regressions).

- [ ] **Step 6: Commit**

```bash
git add components/motion/HoverLift.tsx tests/HoverLift.test.tsx
git commit -m "feat(motion): add HoverLift primitive"
```

---

## Task 7: Convert `Button` to motion component with tap scale

**Files:**
- Modify: `components/Button.tsx`
- Modify: `tests/Button.test.tsx` (add regression-guard test for tap-scale presence)

- [ ] **Step 1: Add a regression-guard test for tap scale**

Append to `tests/Button.test.tsx` inside the existing `describe("Button", ...)` block:

```tsx
  it("preserves type='submit' when wrapping with motion (regression guard)", () => {
    render(<Button type="submit">Send</Button>);
    const btn = screen.getByRole("button", { name: /send/i }) as HTMLButtonElement;
    expect(btn.type).toBe("submit");
  });
```

(Guards against the most common breakage when wrapping with `motion(...)`: losing the underlying element semantics. The existing test `"renders as an <a> when href is provided"` already covers the link path.)

- [ ] **Step 2: Run tests to verify the new ones pass against the current implementation (they should)**

Run:

```bash
npm test -- Button
```

Expected: all Button tests pass (new ones included — current Button already handles these cases; we're just locking it in before refactoring).

- [ ] **Step 3: Convert Button to motion components**

Replace the contents of `components/Button.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { quickTap } from "@/lib/motion";

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
  secondary:
    "bg-white text-navy border-[1.5px] border-navy hover:bg-mist rounded-full",
  tertiary:
    "bg-transparent text-care-blue hover:text-navy underline-offset-4 hover:underline",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const MotionLink = motion(Link);

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

  // Tertiary is a text link — tap-scale would look wrong on inline text.
  const tapScale = variant === "tertiary" ? undefined : { scale: 0.97 };

  if ("href" in props && props.href) {
    return (
      <MotionLink
        href={props.href}
        className={classes}
        aria-label={ariaLabel}
        whileTap={tapScale}
        transition={quickTap}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
      whileTap={tapScale}
      transition={quickTap}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 4: Run Button tests**

Run:

```bash
npm test -- Button
```

Expected: all Button tests pass.

- [ ] **Step 5: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass (LeadForm regression test about submit-button type must still pass).

- [ ] **Step 6: Commit**

```bash
git add components/Button.tsx tests/Button.test.tsx
git commit -m "feat(button): convert to motion component with tap-scale feedback"
```

---

## Task 8: Wrap `TrustBadge` in `motion.span` with hover

**Files:**
- Modify: `components/TrustBadge.tsx`
- Create: `tests/TrustBadge.test.tsx`

- [ ] **Step 1: Write the test**

Write to `tests/TrustBadge.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TrustBadge } from "@/components/TrustBadge";

describe("TrustBadge", () => {
  it("renders its label", () => {
    render(<TrustBadge>Medicare-certified</TrustBadge>);
    expect(screen.getByText(/medicare-certified/i)).toBeInTheDocument();
  });

  it("renders the decorative checkmark with aria-hidden", () => {
    const { container } = render(<TrustBadge>X</TrustBadge>);
    const check = container.querySelector('[aria-hidden="true"]');
    expect(check).not.toBeNull();
    expect(check?.textContent).toBe("✓");
  });
});
```

- [ ] **Step 2: Run the test to verify it passes against current implementation**

Run:

```bash
npm test -- TrustBadge
```

Expected: 2 tests pass.

- [ ] **Step 3: Replace TrustBadge with motion version**

Replace `components/TrustBadge.tsx` with:

```tsx
"use client";

import { motion } from "motion/react";
import { softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function TrustBadge({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();

  const base =
    "inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-medium text-success-green";

  if (reduced) {
    return (
      <span className={base}>
        <span aria-hidden>✓</span>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={base}
      whileHover={{ scale: 1.04, backgroundColor: "#d9ebde" }}
      transition={softSpring}
    >
      <span aria-hidden>✓</span>
      {children}
    </motion.span>
  );
}
```

- [ ] **Step 4: Run the test again**

Run:

```bash
npm test -- TrustBadge
```

Expected: 2 tests still pass.

- [ ] **Step 5: Commit**

```bash
git add components/TrustBadge.tsx tests/TrustBadge.test.tsx
git commit -m "feat(trust-badge): add hover scale + tint via motion.span"
```

---

## Task 9: Add `iconName` field to services in `site-config.ts`

**Files:**
- Modify: `lib/site-config.ts`

No test — pure data shape change. TypeScript catches misuse.

- [ ] **Step 1: Modify the services array**

In `lib/site-config.ts`, replace the entire `services` export with:

```ts
export const services = [
  {
    name: "Skilled Nursing",
    description:
      "Wound care, medication management, chronic disease support.",
    iconName: "Stethoscope",
  },
  {
    name: "Physical Therapy",
    description: "Mobility, strength, balance — post-surgery or progressive.",
    iconName: "PersonSimpleWalk",
  },
  {
    name: "Occupational Therapy",
    description:
      "Daily-living skills — dressing, cooking, bathing, safety.",
    iconName: "HandHeart",
  },
  {
    name: "Speech Therapy",
    description:
      "Communication and swallowing — post-stroke and neurological.",
    iconName: "ChatCircleDots",
  },
  {
    name: "Medical Social Work",
    description: "Benefits navigation, resources, family support.",
    iconName: "UsersThree",
  },
  {
    name: "Home Health Aide",
    description:
      "Personal care — bathing, grooming, meal prep, companionship.",
    iconName: "House",
  },
] as const;

export type ServiceIconName = (typeof services)[number]["iconName"];
```

- [ ] **Step 2: Verify typecheck passes**

Run:

```bash
npm run typecheck
```

Expected: exits 0. (`page.tsx` already iterates `services` and reads `s.name` / `s.description`; the new `iconName` field is additive and won't break the existing usage. The icon-rendering wiring happens in Task 14.)

- [ ] **Step 3: Run tests to verify no regressions**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/site-config.ts
git commit -m "feat(config): add iconName to each service entry"
```

---

## Task 10: Scroll-aware Nav

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `tests/Nav.test.tsx` (add a regression-guard test)

- [ ] **Step 1: Add a regression-guard test for default rendering at top of page**

Append to `tests/Nav.test.tsx` inside the existing `describe("Nav", ...)` block:

```tsx
  it("renders without crashing at scrollY=0 (default state)", () => {
    // Reset scroll position before render
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    render(<Nav />);
    expect(screen.getByLabelText(/lifecare options home/i)).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run Nav tests to verify they still pass before refactor**

Run:

```bash
npm test -- Nav
```

Expected: all Nav tests pass.

- [ ] **Step 3: Replace `Nav.tsx` with scroll-aware version**

Replace `components/Nav.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { siteConfig } from "@/lib/site-config";

const SCROLL_THRESHOLD = 8;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };
    // Initialize from current scroll (handles mid-page hot reload).
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Mobile-menu-open forces "scrolled" styling regardless of position.
  const scrolledStyling = isScrolled || open;

  const headerClasses = [
    "sticky top-0 z-50 border-b border-borderline transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling
      ? "bg-white/98 backdrop-blur shadow-sm"
      : "bg-white/95 backdrop-blur",
  ].join(" ");

  const containerClasses = [
    "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6 transition-all duration-200 ease-out motion-reduce:transition-none",
    scrolledStyling ? "py-3" : "py-4",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
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

(Reduced-motion handling here is via Tailwind's `motion-reduce:transition-none` modifier — instant flip between scrolled and at-top styles. No need to involve the React hook for this particular case since the state change itself isn't animated; only the CSS transition between styles is.)

- [ ] **Step 4: Run Nav tests**

Run:

```bash
npm test -- Nav
```

Expected: all Nav tests pass.

- [ ] **Step 5: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/Nav.tsx tests/Nav.test.tsx
git commit -m "feat(nav): scroll-aware shadow and padding via rAF-throttled listener"
```

---

## Task 11: Source the hero Unsplash photo + add to repo

**Files:**
- Create: `public/images/hero-caring-hands.jpg`
- Create: `lib/hero-image.ts` (centralizes hero image metadata + attribution)

This is a user-collaboration moment: the implementer presents 2-3 specific Unsplash photo candidates that match the "Caring Hands" brief from spec §5.1, the user picks one, the implementer downloads it.

- [ ] **Step 1: Find 2-3 candidate photos on Unsplash**

Search Unsplash (via web browser or `firecrawl-search` skill) for queries that match the brief: "caregiver hands elderly", "holding hands elderly", "hands warm light care". Aim for:

- Close crop (no full bodies)
- No identifiable faces
- Warm tungsten / natural window light
- Composition reads as gentle / caring (not clinical)
- Landscape orientation, minimum 1600×1200

Capture at least 2 candidate Unsplash photo page URLs.

- [ ] **Step 2: Present candidates to user via visual companion**

Use the brainstorming visual companion (server is already running) to render the candidate photos side-by-side. Page header: "Pick the hero photo." Each card embeds the actual Unsplash CDN URL (e.g., `https://images.unsplash.com/photo-{ID}?w=1200&q=80&auto=format&fit=crop`). Below each, link to the original Unsplash page so the user can credit the photographer.

Wait for the user's selection in the terminal before downloading.

- [ ] **Step 3: Download the selected photo**

Replace `{PHOTO_ID}` with the user's chosen Unsplash photo ID. Run from project root:

```bash
curl -L "https://images.unsplash.com/photo-{PHOTO_ID}?w=1600&q=82&auto=format&fit=crop" -o "public/images/hero-caring-hands.jpg"
```

Verify file size is between ~100KB and ~600KB (anything smaller suggests it was a tiny preview, anything larger should be re-compressed):

```bash
ls -lh public/images/hero-caring-hands.jpg
```

- [ ] **Step 4: Create hero image metadata module**

Write to `lib/hero-image.ts`:

```ts
/**
 * Hero photo metadata. Centralized so the page component, image alt text,
 * and any future credit display all reference one source of truth.
 *
 * Updated when the hero image is replaced.
 */
export const heroImage = {
  src: "/images/hero-caring-hands.jpg",
  alt: "A caregiver's hands holding the hands of an elderly patient in warm light.",
  width: 1600,
  height: 1200,
  photographer: "{NAME}", // From Unsplash page
  photographerUrl: "{URL}", // From Unsplash page
  unsplashUrl: "{URL}", // The photo's Unsplash page
} as const;
```

Fill in `{NAME}`, `{URL}` from the selected photo's Unsplash page.

- [ ] **Step 5: Verify the build still succeeds**

Run:

```bash
npm run build
```

Expected: build completes successfully. `next/image` may warn about missing `width`/`height` for the new file — that's fine, we wire those in Task 12.

- [ ] **Step 6: Commit**

```bash
git add public/images/hero-caring-hands.jpg lib/hero-image.ts
git commit -m "feat(hero): add Caring Hands Unsplash photo and metadata module"
```

---

## Task 12: Hero section — motion + photo wiring

**Files:**
- Modify: `app/page.tsx`

This task converts `app/page.tsx` to a client component and overhauls the hero section only. Subsequent tasks (13–15) modify other sections of the same file.

- [ ] **Step 1: Convert `page.tsx` to a client component and rebuild the Hero section**

At the **top** of `app/page.tsx`, replace the existing imports with:

```tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TrustBadge } from "@/components/TrustBadge";
import { LeadForm } from "@/components/LeadForm";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { HoverLift } from "@/components/motion/HoverLift";
import { easeOut, softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { siteConfig, services } from "@/lib/site-config";
import { heroImage } from "@/lib/hero-image";
```

- [ ] **Step 2: Replace the Hero section markup**

Find the Hero section (currently the `{/* 1. Hero */}` block). Replace the entire `<section className="px-4 py-16 ...">...</section>` for that block with:

```tsx
      {/* 1. Hero */}
      <Hero />
```

Then add a `Hero` component definition **above** the `HomePage` export:

```tsx
function Hero() {
  const reduced = useReducedMotionSafe();

  // Helper: when reduced, render at final state immediately; otherwise animate.
  const ifMotion = <T,>(animated: T, still: T): T => (reduced ? still : animated);

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            className="text-care-blue text-xs font-semibold tracking-[0.1em] uppercase"
            initial={ifMotion({ opacity: 0 }, { opacity: 1 })}
            animate={{ opacity: 1 }}
            transition={{ ...easeOut, duration: 0.4, delay: 0 }}
          >
            Home Health · Katy, TX
          </motion.div>

          <motion.h1
            className="mt-3 text-5xl leading-[1.05] md:text-6xl"
            initial={ifMotion({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, duration: 0.6, delay: 0.1 }}
          >
            Quality care,
            <br />
            felt at home.
          </motion.h1>

          <motion.p
            className="text-slate mt-5 max-w-xl text-lg leading-relaxed"
            initial={ifMotion({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, duration: 0.5, delay: 0.25 }}
          >
            Medicare-certified skilled nursing, therapy, and personal care —
            delivered across Katy, Fort Bend, and Harris counties since{" "}
            {siteConfig.foundedYear}.
          </motion.p>

          <div className="mt-7 flex flex-wrap gap-3">
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.4 }}
            >
              <Button href="#contact" size="lg">
                Request info →
              </Button>
            </motion.div>
            <motion.div
              initial={ifMotion({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.48 }}
            >
              <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
                Call {siteConfig.phone}
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="aspect-[4/3] overflow-hidden rounded-2xl"
          initial={ifMotion({ opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 })}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...easeOut, duration: 0.8, delay: 0.2 }}
          whileHover={reduced ? undefined : { scale: 1.02 }}
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run the smoke test to verify the hero still renders**

Run:

```bash
npm test -- smoke
```

Expected: smoke test passes — "quality care", "medicare-certified", and "get in touch" are all still present.

- [ ] **Step 4: Run full test suite + typecheck + lint**

Run:

```bash
npm test && npm run typecheck && npm run lint
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(hero): add entrance choreography and real Unsplash photo"
```

---

## Task 13: Trust strip — icons + FadeUp

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the Phosphor icon import to the top imports**

Find the import block at the top of `app/page.tsx`. Add to the existing imports:

```tsx
import { ShieldCheck, House, PhoneCall } from "@phosphor-icons/react";
```

- [ ] **Step 2: Replace the Trust strip section**

Find the `{/* 2. Trust strip */}` block. Replace its entire `<section>` with:

```tsx
      {/* 2. Trust strip */}
      <FadeUp>
        <section className="border-borderline bg-mist border-y px-4 py-10 md:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-around gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={32} weight="duotone" className="text-navy" />
              <div>
                <div className="font-display text-xl">Medicare-certified</div>
                <div className="text-slate text-xs">
                  + {siteConfig.accreditation}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <House size={32} weight="duotone" className="text-navy" />
              <div>
                <div className="font-display text-xl">
                  Serving Katy since {siteConfig.foundedYear}
                </div>
                <div className="text-slate text-xs">Locally owned</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PhoneCall size={32} weight="duotone" className="text-navy" />
              <div>
                <div className="font-display text-xl">24/7 on-call nursing</div>
                <div className="text-slate text-xs">Always reachable</div>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>
```

- [ ] **Step 3: Run the smoke test**

Run:

```bash
npm test -- smoke
```

Expected: passes. ("medicare-certified" string still present.)

- [ ] **Step 4: Run full suite + typecheck**

Run:

```bash
npm test && npm run typecheck
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(trust-strip): add Phosphor duotone icons and FadeUp entrance"
```

---

## Task 14: About band — FadeUp + Stagger badges

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the About band section**

Find the `{/* 3. About band */}` block. Replace the entire `<section>` with:

```tsx
      {/* 3. About band */}
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <FadeUp>
              <h2 className="text-4xl leading-[1.1]">
                Serving Katy families since 2008.
              </h2>
            </FadeUp>
            <FadeUp delay={120}>
              <p className="text-slate mt-5 text-base leading-relaxed">
                Lifecare Options has served Katy families since 2008. We&apos;re
                a CHAP-accredited, Medicare-certified home health agency, locally
                owned and small enough to know your name. Our clinicians bring
                skilled care into the home — where healing is most natural — and
                we&apos;re on-call 24/7 for whatever comes next.
              </p>
            </FadeUp>
          </div>
          <Stagger className="flex flex-wrap gap-2">
            <StaggerItem>
              <TrustBadge>Medicare-certified</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>
                Serving Katy since {siteConfig.foundedYear}
              </TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>24/7 on-call</TrustBadge>
            </StaggerItem>
          </Stagger>
        </div>
      </section>
```

- [ ] **Step 2: Run smoke + full suite + typecheck**

Run:

```bash
npm test && npm run typecheck
```

Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(about): add scroll reveal + staggered badge entrance"
```

---

## Task 15: Services grid — icons + Stagger + HoverLift

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add additional Phosphor imports**

Find the existing `import { ShieldCheck, House, PhoneCall } from "@phosphor-icons/react";` line. Replace it with:

```tsx
import {
  ShieldCheck,
  House,
  PhoneCall,
  Stethoscope,
  PersonSimpleWalk,
  HandHeart,
  ChatCircleDots,
  UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { ServiceIconName } from "@/lib/site-config";
```

- [ ] **Step 2: Add the icon map constant (above the `HomePage` export, below the `Hero` component)**

```tsx
const SERVICE_ICONS: Record<ServiceIconName, Icon> = {
  Stethoscope,
  PersonSimpleWalk,
  HandHeart,
  ChatCircleDots,
  UsersThree,
  House,
};
```

- [ ] **Step 3: Replace the Services grid section**

Find the `{/* 4. Services at a glance */}` block. Replace its entire `<section>` with:

```tsx
      {/* 4. Services at a glance */}
      <section className="bg-mist px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <div className="text-care-blue text-xs font-semibold tracking-[0.1em] uppercase">
                Our services
              </div>
              <h2 className="mt-2 text-4xl leading-[1.1]">
                Six disciplines, one coordinated plan
              </h2>
              <p className="text-slate mt-3 text-base">
                Physician-ordered home health covered by Medicare. Our team works
                together around your care plan — no handoff gaps.
              </p>
            </div>
          </FadeUp>
          <Stagger className="grid gap-3 md:grid-cols-3">
            {services.map((s, i) => {
              const variant =
                i % 3 === 0 ? "peach" : i % 3 === 1 ? "white" : "mist";
              const IconComponent = SERVICE_ICONS[s.iconName];
              return (
                <StaggerItem key={s.name}>
                  <HoverLift className="h-full">
                    <Card variant={variant} className="h-full">
                      <IconComponent
                        size={36}
                        weight="duotone"
                        className="text-navy"
                      />
                      <div className="font-display mt-3 text-xl">{s.name}</div>
                      <div className="text-slate mt-2 text-sm">
                        {s.description}
                      </div>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
```

- [ ] **Step 4: Run smoke test**

Run:

```bash
npm test -- smoke
```

Expected: all 6 service names ("skilled nursing", "physical therapy", etc.) still in the DOM. (The current smoke test doesn't explicitly assert every service name, but the existing pass condition still holds.)

- [ ] **Step 5: Run full suite + typecheck + lint**

Run:

```bash
npm test && npm run typecheck && npm run lint
```

Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat(services): add Phosphor icons, staggered entrance, hover lift"
```

---

## Task 16: Reduced-motion smoke test

**Files:**
- Create: `tests/reduced-motion.test.tsx`

Verifies that when `prefers-reduced-motion` is enabled, all critical content remains visible (no entrance animation accidentally leaves an element at `opacity: 0`).

- [ ] **Step 1: Write the test**

Write to `tests/reduced-motion.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Force the reduced-motion hook to report true *before* importing the page,
// so all motion components mount in their reduced-motion branch.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

// Import after the mock is registered.
import HomePage from "@/app/page";
import { services } from "@/lib/site-config";

describe("Homepage with prefers-reduced-motion: reduce", () => {
  it("renders all critical hero, trust, and services content visibly", () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? "";

    // Hero
    expect(text).toMatch(/quality care/i);
    expect(text).toMatch(/felt at home/i);
    expect(text).toMatch(/request info/i);

    // Trust strip
    expect(text).toMatch(/medicare-certified/i);
    expect(text).toMatch(/24\/7 on-call/i);

    // About
    expect(text).toMatch(/serving katy families/i);

    // Every service name rendered
    for (const s of services) {
      expect(text).toContain(s.name);
    }

    // Contact form heading
    expect(text).toMatch(/get in touch/i);
  });
});
```

- [ ] **Step 2: Run the test**

Run:

```bash
npm test -- reduced-motion
```

Expected: 1 test passes. (If any content is missing from the DOM, that points to a motion primitive that's hiding content in its reduced-motion branch — fix that primitive.)

- [ ] **Step 3: Run full suite + typecheck + lint**

Run:

```bash
npm test && npm run typecheck && npm run lint
```

Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add tests/reduced-motion.test.tsx
git commit -m "test: add reduced-motion content-visibility smoke test"
```

---

## Task 17: Production build verification

**Files:** none

- [ ] **Step 1: Clean build**

Run:

```bash
rm -rf .next && npm run build
```

Expected: build succeeds end-to-end. No SSR hydration errors. No "use client" boundary errors. Bundle output prints without warnings about missing modules.

- [ ] **Step 2: Spot-check the Phosphor bundle impact**

Look for the page-route bundle line in the build output. Confirm Phosphor's footprint is reasonable (per-icon tree-shaking should keep this small; if a page bundle grew by more than ~50KB raw, investigate).

- [ ] **Step 3: Start production server and smoke test in browser**

Run:

```bash
npm run start
```

In a separate terminal or browser, visit `http://localhost:3000`. Verify:

- Hero photo loads (not the placeholder gradient)
- Hero text + buttons animate in on page load
- Scrolling down: trust strip fades in, about band reveals, badges stagger
- Services grid: cards stagger in when scrolled into view; hovering lifts each card
- Nav: shadow appears + padding tightens after a small scroll
- Tap any button: gentle scale feedback on press

Then in DevTools → Rendering → Emulate CSS prefers-reduced-motion: `reduce`, reload, and verify:

- All sections immediately visible (no fade-in delay)
- Hover on services: no lift
- Tap button: scale still happens (interaction feedback preserved)
- Nav scroll-state still toggles, but instantly (no transition)

Stop the server with `Ctrl+C` when done.

- [ ] **Step 4: Final commit (if anything needed adjustment)**

If the browser walkthrough surfaced any cosmetic fixes (timing tweaks, icon swaps), make them now and commit. Otherwise:

```bash
git status  # should show clean tree
```

- [ ] **Step 5: Summarize for the user**

Report back:

- All 17 tasks complete
- Spec sections implemented: §1 motion system, §2 hero, §3 trust/about/services, §4 nav/buttons, §5 reduced motion + tests
- Test count delta (was 34; now N)
- Bundle size delta
- Any deviations from spec (should be zero — flag any if present)
- Hand off for user review in browser
