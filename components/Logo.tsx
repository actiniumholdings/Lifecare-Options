import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  /** If true, renders just the icon portion (square crop) — Phase 1+. */
  iconOnly?: boolean;
  /** For use on dark backgrounds (Footer). Currently unused since the PNG
   * has its own navy-on-navy contrast, but kept for API compatibility. */
  inverse?: boolean;
};

// Aspect ratio of the full lockup PNG: 3686 × 1152 ≈ 3.2:1
const LOCKUP_ASPECT = 3686 / 1152;

const SIZES = {
  sm: 32, // height in px
  md: 44,
  lg: 64,
} as const;

export function Logo({ size = "md" }: LogoProps) {
  const h = SIZES[size];
  const w = Math.round(h * LOCKUP_ASPECT);

  return (
    <Link
      href="/"
      className="inline-flex items-center no-underline"
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src="/images/logo-icon.png"
        alt={`${siteConfig.name} — ${siteConfig.tagline}`}
        width={w}
        height={h}
        priority
        className="h-auto w-auto"
        style={{ height: `${h}px`, width: `${w}px` }}
      />
    </Link>
  );
}
