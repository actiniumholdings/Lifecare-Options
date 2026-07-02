import { Section } from "@/components/ui/Section";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";

const STEPS: { title: string; body: string }[] = [
  {
    title: "We listen",
    body: "A care coordinator answers, learns the situation, and helps you understand how home health can help — from skilled nursing to therapy to personal support.",
  },
  {
    title: "We coordinate",
    body: "We verify coverage, connect with the physician, and arrange an in-home assessment, handling the paperwork so your family doesn't have to.",
  },
  {
    title: "Care begins at home",
    body: "A licensed professional starts a personalized plan of care, with ongoing oversight and a team you can reach whenever you need us.",
  },
];

/**
 * Reassuring 3-step explainer for first-time callers. Large blue Fraunces
 * numerals over a connecting hairline give it editorial structure rather than
 * a generic "three icons in a row".
 */
export function HowItWorks() {
  return (
    <Section
      tone="light"
      eyebrow="What to Expect"
      title="When you call, here's what happens"
      intro="Reaching out shouldn't feel daunting. The first call is simple, human, and pressure-free."
    >
      <Stagger
        className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
        stagger={0.12}
      >
        {/* Connecting hairline across the steps (desktop). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-care-blue/40 to-transparent md:block"
        />
        {STEPS.map((step, i) => (
          <FadeUp as="article" key={step.title} className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-care-blue/40 bg-canvas font-display text-2xl font-semibold text-blue-deep shadow-[0_8px_24px_-12px_rgba(13,43,73,0.3)]">
              {i + 1}
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold leading-tight text-navy">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-slate">
              {step.body}
            </p>
          </FadeUp>
        ))}
      </Stagger>
    </Section>
  );
}

export default HowItWorks;
