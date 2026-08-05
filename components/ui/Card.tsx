import type { ReactNode } from "react";

export interface CardProps {
  /** Restrained top accent rule: "blue" | "navy" | "none" (default). */
  accent?: "blue" | "navy" | "none";
  className?: string;
  children?: ReactNode;
}

/**
 * White card on ivory — hairline border + soft shadow, generous padding,
 * a gentle hover lift. The workhorse surface of the site.
 */
export function Card({ accent = "none", className, children }: CardProps) {
  const accentRule =
    accent === "blue"
      ? "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-[var(--radius)] before:bg-peach before:content-['']"
      : accent === "navy"
        ? "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-[var(--radius)] before:bg-navy before:content-['']"
        : "";

  const classes = [
    "group relative overflow-hidden rounded-[var(--radius)]",
    "bg-card border border-navy/10",
    "p-8 sm:p-10",
    "shadow-[0_2px_4px_rgb(from_var(--color-navy)_r_g_b_/_0.04),0_16px_36px_-16px_rgb(from_var(--color-navy)_r_g_b_/_0.14)]",
    "transition-[transform,box-shadow,border-color] duration-300 ease-out",
    "hover:-translate-y-1 hover:border-navy/15",
    "hover:shadow-[0_2px_4px_rgb(from_var(--color-navy)_r_g_b_/_0.05),0_18px_40px_-16px_rgb(from_var(--color-navy)_r_g_b_/_0.22)]",
    accentRule,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

export default Card;
