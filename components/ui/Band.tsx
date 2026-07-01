import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function Band({
  eyebrow,
  headline,
  className = "",
}: {
  eyebrow?: ReactNode;
  headline: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-cream px-4 py-16 md:px-8 md:py-20 ${className}`}>
      <Container>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <p className="mt-3 max-w-3xl font-display text-2xl leading-snug text-navy md:text-3xl">
          {headline}
        </p>
      </Container>
    </section>
  );
}
