import Image from "next/image";

export interface BrandMotifProps {
  className?: string;
  /** Opacity of the watermark (0–1). Default 0.06. */
  opacity?: number;
}

/**
 * A large, faint brand-mark watermark for navy panels. Purely decorative
 * (hidden from a11y tree). Uses the transparent tile-cropped watermark asset
 * (logo-watermark.png) so only the logo's own rounded silhouette washes over
 * the band — the raw logo-square.png has an opaque white margin that reads as
 * a square seam at low opacity. `className` controls size + positioning.
 */
export function BrandMotif({ className, opacity = 0.06 }: BrandMotifProps) {
  return (
    <Image
      src="/images/logo-watermark.png"
      alt=""
      aria-hidden="true"
      width={600}
      height={600}
      className={className}
      style={{ opacity }}
    />
  );
}

export default BrandMotif;
