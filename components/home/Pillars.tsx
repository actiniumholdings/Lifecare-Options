import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";

interface PillarData {
  eyebrow: string;
  name: string;
  blurb: string;
  services: string[];
  cta: string;
}

/**
 * Lifecare runs a single skilled-home-health line. To keep Central's two-card
 * rhythm honestly, we group the seven disciplines into clinical care and
 * in-home support — both delivered by one coordinated team.
 */
const PILLARS: PillarData[] = [
  {
    eyebrow: "Medicare-Certified",
    name: "Skilled Clinical Care",
    blurb:
      "Licensed clinicians bring hospital-grade skill into the home — restoring strength, managing conditions, and speeding recovery.",
    services: [
      "Skilled Nursing",
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
    ],
    cta: "Explore clinical care",
  },
  {
    eyebrow: "In-Home Support",
    name: "Support & Daily Living",
    blurb:
      "Personal, practical, and connected care that keeps daily life comfortable, safe, and dignified at home.",
    services: [
      "Home Health Aide",
      "Medical Social Work",
      "Remote Patient Monitoring",
    ],
    cta: "Explore support services",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover/link:translate-x-0.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-blue-deep"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PillarCard({ pillar }: { pillar: PillarData }) {
  return (
    <FadeUp as="article" className="h-full">
      <Card accent="blue" className="flex h-full flex-col">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-blue-deep">
          {pillar.eyebrow}
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-navy sm:text-3xl">
          {pillar.name}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-slate">{pillar.blurb}</p>

        <ul className="mt-6 space-y-3">
          {pillar.services.map((service) => (
            <li key={service} className="flex items-start gap-3">
              <CheckMark />
              <span className="text-[0.95rem] font-medium leading-snug text-navy">
                {service}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-navy/10 pt-6">
          <Link
            href="/services"
            className="group/link inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-blue-deep"
          >
            {pillar.cta}
            <ArrowIcon />
          </Link>
        </div>
      </Card>
    </FadeUp>
  );
}

/**
 * The two facets of Lifecare's home-health line — skilled clinical care and
 * in-home support — each an equal-height card that links into /services.
 */
export function Pillars() {
  return (
    <Section
      tone="light"
      eyebrow="What We Do"
      title="Comprehensive home health, one coordinated team"
      intro="Whether the need is clinical or personal, our team meets it at home — with the right professional at the right time, coordinated with your physician."
    >
      <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.12}>
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.name} pillar={pillar} />
        ))}
      </Stagger>
    </Section>
  );
}

export default Pillars;
