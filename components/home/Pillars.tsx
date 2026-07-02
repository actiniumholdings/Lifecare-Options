import { Section } from "@/components/ui/Section";
import { PillarCard } from "@/components/ui/PillarCard";
import { Stagger } from "@/components/motion/Stagger";
import { FadeUp } from "@/components/motion/FadeUp";

/**
 * Lifecare's two service lines, presented as equal pillars (spec §6 Home).
 * Skilled Home Health = the Medicare-certified clinical benefit; Provider
 * Attendant Services = the Medicaid/private-pay daily-living line. Each links
 * to its dedicated page (built in Plan 3).
 */
const PILLARS = [
  {
    eyebrow: "Medicare-certified",
    title: "Skilled Home Health",
    description:
      "Licensed clinicians bring hospital-grade skill into the home — nursing, therapy, and medical social work coordinated with your physician.",
    services: [
      "Skilled Nursing",
      "Physical, Occupational & Speech Therapy",
      "Medical Social Work",
      "Home Health Aide",
      "Remote Patient Monitoring",
    ],
    payerHint: "Medicare · Medicare Advantage · commercial plans",
    href: "/services/skilled",
    cta: "Explore skilled care",
  },
  {
    eyebrow: "Medicaid · Private pay",
    title: "Provider Attendant Services",
    description:
      "Trained attendants help with the everyday tasks that keep daily life safe, dignified, and independent at home.",
    services: [
      "Bathing, dressing & grooming",
      "Meal preparation",
      "Light housekeeping & laundry",
      "Errands & escort to appointments",
    ],
    payerHint: "Medicaid (PHC · CAS · FC) · STAR+PLUS · private pay",
    href: "/services/attendant",
    cta: "Explore attendant care",
  },
] as const;

export function Pillars() {
  return (
    <Section
      tone="light"
      eyebrow="What We Do"
      title="Two ways we bring care home"
      intro="Whether the need is clinical recovery or everyday support, Lifecare meets it at home — with the right professional at the right time."
    >
      <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.12}>
        {PILLARS.map((p) => (
          <FadeUp as="div" key={p.title} className="h-full">
            <PillarCard {...p} services={[...p.services]} />
          </FadeUp>
        ))}
      </Stagger>
    </Section>
  );
}

export default Pillars;
