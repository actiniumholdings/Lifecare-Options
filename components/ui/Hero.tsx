import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/Button";

type Cta = { label: string; href: string };

export function Hero({
  eyebrow,
  headline,
  intro,
  primaryCta,
  secondaryCta,
  children,
}: {
  eyebrow: ReactNode;
  headline: ReactNode;
  intro?: ReactNode;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  children?: ReactNode;
}) {
  return (
    <section className="bg-mist px-4 py-12 md:px-8 md:py-24">
      <Container className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3">{headline}</h1>
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
        <div className="relative min-h-64">
          {children ?? (
            <div
              aria-hidden
              className="aspect-[4/3] w-full rounded-2xl"
              style={{ background: "linear-gradient(135deg, #E4ECF3 0%, #FDEEDD 100%)" }}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
