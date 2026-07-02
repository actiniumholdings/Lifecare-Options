import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };
type Badge = { label: string; icon?: ReactNode };

export interface InteriorHeroProps {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Required — interior heroes always carry a real photograph. */
  photoSrc: string;
  photoAlt: string;
  badges?: Badge[];
}

/**
 * Interior-page hero (spec §5): compact photo treatment on the sky band.
 * The home flagship hero lives in components/home/Hero.tsx — this one is
 * for the 10 interior routes.
 */
export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
  photoSrc,
  photoAlt,
  badges,
}: InteriorHeroProps) {
  return (
    <section className="bg-sky-soft px-4 py-14 md:px-8 md:py-20">
      <Container className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-display-xl font-semibold text-navy text-balance">
            {headline}
          </h1>
          {intro && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">{intro}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
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

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          {badges && badges.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-navy shadow-md"
                >
                  {badge.icon && <span aria-hidden>{badge.icon}</span>}
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
