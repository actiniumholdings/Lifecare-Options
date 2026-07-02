"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { quickTap } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  "aria-label"?: string;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

type ButtonAsLink = BaseProps & {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-care-blue-deep text-navy hover:bg-care-blue-deep/90 rounded-full",
  secondary:
    "bg-transparent text-navy border-[1.5px] border-navy hover:bg-navy/5 rounded-full",
  tertiary:
    "bg-transparent text-navy hover:text-care-blue underline-offset-4 hover:underline",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const MotionLink = motion.create(Link);

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    "aria-label": ariaLabel,
  } = props;

  const classes = twMerge(
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className
  );

  // Tertiary is a text link — tap-scale would look wrong on inline text.
  const tapScale = variant === "tertiary" ? undefined : { scale: 0.97 };

  if ("href" in props && props.href) {
    return (
      <MotionLink
        href={props.href}
        className={classes}
        aria-label={ariaLabel}
        whileTap={tapScale}
        transition={quickTap}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
      whileTap={tapScale}
      transition={quickTap}
    >
      {children}
    </motion.button>
  );
}
