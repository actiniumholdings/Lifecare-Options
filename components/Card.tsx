import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  variant?: "peach" | "mist" | "white";
  children: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  peach: "bg-peach-cream",
  mist: "bg-mist border border-borderline",
  white: "bg-white border border-borderline",
};

export function Card({ variant = "white", children, className }: CardProps) {
  return (
    <div className={twMerge("rounded-xl p-6", VARIANT[variant], className)}>
      {children}
    </div>
  );
}
