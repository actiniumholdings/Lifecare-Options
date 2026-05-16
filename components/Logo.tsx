import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  inverse?: boolean;
};

// Icon size (in px) and wordmark text sizes per logo size.
// Icon and text are sized independently so we can fine-tune each.
const SIZES = {
  sm: {
    icon: 28,
    title: "text-sm",
    tagline: "text-[9px]",
    gap: "gap-2",
    tagMargin: "mt-0.5",
  },
  md: {
    icon: 56,
    title: "text-lg",
    tagline: "text-[11px]",
    gap: "gap-3",
    tagMargin: "mt-0.5",
  },
  lg: {
    icon: 56,
    title: "text-3xl",
    tagline: "text-sm",
    gap: "gap-4",
    tagMargin: "mt-1",
  },
} as const;

export function Logo({
  size = "md",
  iconOnly = false,
  inverse = false,
}: LogoProps) {
  const s = SIZES[size];
  const titleColor = inverse ? "text-white" : "text-navy";
  const taglineColor = inverse ? "text-cream" : "text-slate";

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${s.gap} no-underline`}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src="/images/logo-square.png"
        alt=""
        width={s.icon}
        height={s.icon}
        priority
        className="rounded-lg"
      />
      {!iconOnly && (
        <span className="flex flex-col justify-center leading-[1.1]">
          <span
            className={`font-display font-medium ${s.title} ${titleColor}`}
          >
            {siteConfig.name}
          </span>
          <span
            className={`${s.tagMargin} font-sans uppercase tracking-[0.15em] font-medium ${s.tagline} ${taglineColor}`}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
