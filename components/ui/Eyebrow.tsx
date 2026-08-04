import type { ReactNode } from "react";

export type EyebrowTone = "light" | "dark";

export interface EyebrowProps {
  /**
   * Background the eyebrow sits on. On "light" (ivory) backgrounds we use
   * blue-deep for AA legibility; on "dark" (navy) sections a lighter blue sings.
   */
  tone?: EyebrowTone;
  className?: string;
  children?: ReactNode;
}

/**
 * Small blue uppercase tracked label — the editorial signature that sits
 * above every major section title.
 */
export function Eyebrow({ tone = "light", className, children }: EyebrowProps) {
  const color = tone === "dark" ? "text-blue-light" : "text-blue-deep";
  const classes = [
    "inline-flex items-center gap-2",
    "font-sans text-xs font-semibold uppercase tracking-[0.18em]",
    color,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes}>
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

export default Eyebrow;
