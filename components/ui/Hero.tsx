import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };
type Badge = { label: string; icon?: ReactNode };

export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
  photoSrc,
  photoAlt,
  badges,
  children,
}: {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  photoSrc?: string;
  photoAlt?: string;
  badges?: Badge[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-mist px-4 py-12 md:px-8 md:py-24">
      <Container className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        {/* Text column */}
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-navy">{headline}</h1>
          {intro && <p className="mt-5 max-w-xl text-lg text-slate">{intro}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3">
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

        {/* Media column */}
        <div className="relative min-h-64">
          {children ?? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-care-blue">
              {photoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photoSrc}
                  alt={photoAlt ?? ""}
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                /* Gradient fallback — aria-hidden so screenreaders skip the decorative panel */
                <div aria-hidden className="absolute inset-0" />
              )}

              {/* Floating badge pills */}
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
          )}
        </div>
      </Container>
    </section>
  );
}
