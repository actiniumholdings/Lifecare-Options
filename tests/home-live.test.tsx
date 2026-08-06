import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { axe } from "vitest-axe";

// Force the reduced-motion hook to report true *before* importing the section
// components, so all motion components mount in their reduced-motion branch.
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

// Import after the mock is registered.
import { Hero } from "@/components/home/Hero";
import { TrustBand } from "@/components/home/TrustBand";
import { Pillars } from "@/components/home/Pillars";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyLifecare } from "@/components/home/WhyLifecare";
import { ServiceAreaTeaser } from "@/components/home/ServiceAreaTeaser";
import { CareersTeaser } from "@/components/home/CareersTeaser";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PhotoBand } from "@/components/ui/PhotoBand";

/**
 * The live flagship home. This mirrors the exact section composition and
 * PhotoBand props from app/[locale]/page.tsx (not imported directly — its
 * top-level next-intl/server import is server-only and breaks jsdom). The
 * flagship components hardcode English and do not use next-intl, so no
 * NextIntlClientProvider is needed here.
 */
function renderHome() {
  return render(
    <>
      <Hero />
      <TrustBand />
      <Pillars />
      <HowItWorks />
      <WhyLifecare />
      <PhotoBand
        src="/images/dignity-visit.jpg"
        alt="An older woman watering the potted geraniums on her back porch while her Lifecare Options attendant sits nearby"
        eyebrow="Dignity in Every Visit"
        headline="You set the routine. We fit into it."
        objectPosition="50% 23%"
        align="center"
      />
      <ServiceAreaTeaser />
      <CareersTeaser />
      <FinalCTA />
    </>,
  );
}

describe("Live home (app/[locale]/page.tsx composition)", () => {
  it("has no axe-detected a11y violations on initial render", async () => {
    const { container } = renderHome();
    const results = await axe(container);
    // Using direct violations check instead of vitest-axe's toHaveNoViolations
    // matcher — Vitest 4 changed the namespace that custom matchers augment,
    // and vitest-axe's types haven't caught up yet.
    expect(results.violations).toEqual([]);
  }, 15000);

  it("renders all critical content visibly under prefers-reduced-motion: reduce", () => {
    const { container } = renderHome();
    const text = container.textContent ?? "";

    // Hero
    expect(text).toMatch(/expert care, delivered with warmth/i);
    // Trust stats
    expect(text).toMatch(/years serving katy/i);
    // Pillars
    expect(text).toMatch(/skilled home health/i);
  });

  it("never renders any element with inline style opacity:0 (motion-visibility regression test)", () => {
    const { container } = renderHome();
    const allElements = container.querySelectorAll("*");
    const hiddenElements: string[] = [];
    allElements.forEach((el) => {
      const opacity = (el as HTMLElement).style.opacity;
      if (opacity === "0") {
        hiddenElements.push(el.tagName + " " + el.className.slice(0, 60));
      }
    });
    expect(hiddenElements).toEqual([]);
  });
});
