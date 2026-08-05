import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface PhotoBandProps {
  src: string;
  alt: string;
  eyebrow?: string;
  headline?: ReactNode;
  /** CSS object-position for the photo (e.g. "center", "50% 35%"). */
  objectPosition?: string;
  priority?: boolean;
}

/**
 * Full-width editorial photograph band. A single warm image with a navy
 * legibility wash, a blue hairline, and an optional eyebrow + short headline
 * set bottom-left — a human "breath" between typographic sections. Photo fills
 * via next/image (object-cover); tune the crop with objectPosition.
 */
export function PhotoBand({
  src,
  alt,
  eyebrow,
  headline,
  objectPosition = "center",
  priority = false,
}: PhotoBandProps) {
  return (
    <section className="relative isolate flex min-h-[360px] items-end overflow-hidden bg-navy-deep sm:min-h-[440px] lg:min-h-[500px]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
      {/* Navy legibility wash + brand cohesion */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/25 to-navy-deep/5"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-care-blue/40" />
      {(eyebrow || headline) && (
        <Container className="relative py-10 sm:py-12">
          <div className="max-w-2xl">
            {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
            {headline && (
              <p className="mt-4 font-display text-2xl leading-snug text-balance text-white sm:text-3xl">
                {headline}
              </p>
            )}
          </div>
        </Container>
      )}
    </section>
  );
}

export default PhotoBand;
