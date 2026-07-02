import Link from "next/link";
import { Eyebrow } from "./Eyebrow";

export interface PillarCardProps {
  eyebrow: string;
  title: string;
  description: string;
  services: string[];
  /** Optional payer/funding caption. Omit to keep the card free of payer info. */
  payerHint?: string;
  href: string;
  cta: string;
}

/**
 * One of the two service-line pillars (spec §6 Home / Services hub).
 * White card, hairline border, blue top rule, check-list, payer caption.
 */
export function PillarCard({
  eyebrow,
  title,
  description,
  services,
  payerHint,
  href,
  cta,
}: PillarCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-navy/10 border-t-4 border-t-blue-deep bg-card p-8 shadow-sm transition-shadow hover:shadow-lg">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 className="mt-3 font-display text-title font-semibold text-navy">{title}</h3>
      <p className="mt-3 leading-relaxed text-slate">{description}</p>
      <ul className="mt-6 space-y-2.5">
        {services.map((service) => (
          <li key={service} className="flex items-start gap-2.5 text-navy">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="mt-1 h-4 w-4 shrink-0 fill-none stroke-blue-deep stroke-2"
            >
              <path d="M2.5 8.5l3.5 3.5 7-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {service}
          </li>
        ))}
      </ul>
      {payerHint && (
        <p className="mt-6 border-t border-navy/10 pt-4 text-caption font-medium uppercase tracking-wide text-slate">
          {payerHint}
        </p>
      )}
      <Link
        href={href}
        className="group mt-6 inline-flex items-center gap-1.5 font-medium text-blue-deep hover:text-navy"
      >
        {cta}
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </article>
  );
}
