import Link from "next/link";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
  primary: "bg-care-blue text-white hover:bg-[#4a7aa3] rounded-full",
  secondary:
    "bg-white text-navy border-[1.5px] border-navy hover:bg-mist rounded-full",
  tertiary:
    "bg-transparent text-care-blue hover:text-navy underline-offset-4 hover:underline",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

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

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
