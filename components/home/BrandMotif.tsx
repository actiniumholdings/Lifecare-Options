import Image from "next/image";

export interface BrandMotifProps {
  className?: string;
  /** Opacity of the watermark (0–1). Default 0.06. */
  opacity?: number;
}

/**
 * A large, faint brand-mark watermark for navy panels. Purely decorative
 * (hidden from a11y tree). Renders the Lifecare square logo so the watermark
 * matches the brand. `className` controls size + positioning; `opacity` the wash.
 */
export function BrandMotif({ className, opacity = 0.06 }: BrandMotifProps) {
  return (
    <Image
      src="/images/logo-square.png"
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
