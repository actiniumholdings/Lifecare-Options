import { Section } from "@/components/ui/Section";
import { StepList } from "@/components/ui/StepList";

const STEPS = [
  {
    title: "We listen",
    body: "A care coordinator answers, learns the situation, and helps you understand which kind of care fits: skilled recovery, everyday attendant support, or both.",
  },
  {
    title: "We coordinate",
    body: "We check your coverage, connect with any physician involved, and arrange an in-home assessment, handling the paperwork so your family doesn’t have to.",
  },
  {
    title: "Care begins at home",
    body: "The right professional starts a personalized plan of care, with ongoing oversight and a team you can reach whenever you need us.",
  },
];

/**
 * Reassuring 3-step explainer for first-time callers, spanning both service
 * lines (spec §6 Home). Uses the canonical StepList primitive.
 */
export function HowItWorks() {
  return (
    <Section
      tone="light"
      eyebrow="What to Expect"
      title="When you call, here’s what happens"
      intro="Reaching out shouldn’t feel daunting. The first call is simple, human, and pressure-free."
    >
      <StepList steps={STEPS} />
    </Section>
  );
}

export default HowItWorks;
