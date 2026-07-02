import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

export function Band({
  eyebrow,
  headline,
  photoSrc,
  photoAlt,
  className = "",
}: {
  eyebrow?: ReactNode;
  headline: ReactNode;
  photoSrc?: string;
  photoAlt?: string;
  className?: string;
}) {
  return (
    <section className={`bg-sky-soft px-4 py-16 md:px-8 md:py-20 ${className}`}>
      <Container className={photoSrc ? "grid items-center gap-8 md:grid-cols-2" : undefined}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <p className="mt-3 max-w-3xl font-display text-2xl leading-snug text-navy md:text-3xl">
            {headline}
          </p>
        </div>
        {photoSrc && (
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc}
              alt={photoAlt ?? ""}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
