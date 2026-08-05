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
  /** object-position for the desktop full-bleed crop. Default "60% center". */
  objectDesktop?: string;
  /** object-position for the mobile photo band. Default "50% center". */
  objectMobile?: string;
}

/**
 * Interior-page hero (spec §5): a full-bleed photographic treatment on navy.
 * The photograph is never boxed — on desktop it bleeds off the right while a
 * navy gradient wash carries the copy on the left and clears to reveal the
 * image; on mobile the photo becomes a band on top with the copy stacked on
 * navy below. All text is live HTML (accessible, responsive, SEO). Renders a
 * single <h1>, so use exactly one Hero per page. The home flagship hero lives
 * in components/home/Hero.tsx — this one is for the 10 interior routes.
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
  objectDesktop = "60% center",
  objectMobile = "50% center",
}: InteriorHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {/* Desktop: full-bleed photo bleeding off the right, navy wash on the left */}
      <div aria-hidden="true" className="absolute inset-0 z-0 hidden lg:block">
        <Image
          src={photoSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: objectDesktop }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep from-30% via-navy-deep/80 via-55% to-navy-deep/10" />
      </div>

      {/* Mobile / tablet: photo as a band on top, text on navy below */}
      <div className="relative z-0 block lg:hidden">
        <div className="relative aspect-[16/11] w-full">
          <Image
            src={photoSrc}
            alt={photoAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: objectMobile }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent"
          />
        </div>
      </div>

      <Container className="relative z-10 pb-16 pt-12 sm:pb-20 lg:py-28">
        <div className="max-w-xl">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-display-xl text-balance text-white">
            {headline}
          </h1>
          {intro && (
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">{intro}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryCta && (
                <Button href={primaryCta.href} variant="onDark" size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button
                  href={secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="border-white/40 bg-transparent text-white hover:border-white/70 hover:bg-white/10 hover:text-white"
                >
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
          {badges && badges.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20"
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
