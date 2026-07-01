import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  variant?: "peach" | "mist" | "white";
  children: ReactNode;
  className?: string;
};

const VARIANT: Record<NonNullable<CardProps["variant"]>, string> = {
  peach: "bg-cream border border-border",
  mist: "bg-white border border-border",
  white: "bg-white border border-border",
};

export function Card({ variant = "white", children, className }: CardProps) {
  return (
    <div className={twMerge("rounded-xl p-6", VARIANT[variant], className)}>
      {children}
    </div>
  );
}
