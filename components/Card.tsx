import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  variant?: "care-blue" | "amber" | "white";
  children: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  "care-blue": "bg-white border border-care-blue/20",
  amber: "bg-white border border-amber/20",
  white: "bg-white border border-border",
};

export function Card({ variant = "white", children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-2xl p-6 shadow-[0_10px_30px_-12px_rgba(15,43,71,0.15)]",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
