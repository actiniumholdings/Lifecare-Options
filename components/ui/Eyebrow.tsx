import type { ReactNode } from "react";

export type EyebrowTone = "light" | "dark";

export interface EyebrowProps {
  /**
   * Background the eyebrow sits on. On "light" (cream) backgrounds blue-deep
   * carries AA; on "dark" (warm-indigo) sections PEACH is the accent text
   * (6.8:1) — blue-light no longer clears AA on the lighter dark band
   * (spec 2026-08-05).
   */
  tone?: EyebrowTone;
  className?: string;
  children?: ReactNode;
}

/**
 * Small uppercase tracked label above section titles. The leading mark is
 * Lifecare's short rounded peach stroke (vs Central's thin hairline).
 */
export function Eyebrow({ tone = "light", className, children }: EyebrowProps) {
  const color = tone === "dark" ? "text-peach" : "text-blue-deep";
  const classes = [
    "inline-flex items-center gap-2.5",
    "font-sans text-xs font-bold uppercase tracking-[0.14em]",
    color,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes}>
      <span aria-hidden="true" className="h-1 w-6 rounded-full bg-peach" />
      {children}
    </span>
  );
}

export default Eyebrow;
