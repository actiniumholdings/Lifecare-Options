import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  inverse?: boolean;
};

const SIZES = {
  sm: { icon: 28, text: "text-sm", sub: "text-[9px]" },
  md: { icon: 36, text: "text-base", sub: "text-[10px]" },
  lg: { icon: 56, text: "text-2xl", sub: "text-xs" },
} as const;

export function Logo({
  size = "md",
  iconOnly = false,
  inverse = false,
}: LogoProps) {
  const s = SIZES[size];
  const textColor = inverse ? "text-white" : "text-navy";
  const subColor = inverse ? "text-peach-cream" : "text-slate";

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 no-underline"
      aria-label={`${siteConfig.name} home`}
    >
      {/* Using plain <img> tag for local SVG — next/image requires
          dangerouslyAllowSVG config that we don't need for a static,
          trusted, in-repo asset. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-icon.svg"
        alt=""
        width={s.icon}
        height={s.icon}
        className="rounded-lg"
      />
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-medium ${s.text} ${textColor}`}
          >
            {siteConfig.name}
          </span>
          <span
            className={`mt-1 font-sans uppercase tracking-widest ${s.sub} ${subColor}`}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
