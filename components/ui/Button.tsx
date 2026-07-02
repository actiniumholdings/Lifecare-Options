import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant = "primary" | "accent" | "outline";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] " +
  "font-sans font-medium tracking-tight leading-none text-center " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out " +
  "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-blue-deep focus-visible:ring-offset-canvas " +
  "disabled:pointer-events-none disabled:opacity-50 select-none";

const sizes: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
};

const variants: Record<ButtonVariant, string> = {
  // Navy fill / white text — the default action.
  primary:
    "bg-navy text-white shadow-sm hover:bg-navy-deep hover:shadow-md " +
    "hover:-translate-y-0.5 active:translate-y-0",
  // Blue-deep fill / white text — the signature "Refer a Patient" CTA, most
  // prominent. (Central's gold role; AA-safe as white-on-blue-deep, 6.7:1.)
  accent:
    "bg-blue-deep text-white shadow-sm hover:bg-navy hover:shadow-md " +
    "hover:-translate-y-0.5 active:translate-y-0",
  // Transparent / navy text / refined hairline border.
  outline:
    "bg-transparent text-navy border border-navy/20 hover:border-navy/40 " +
    "hover:bg-navy/[0.04] hover:-translate-y-0.5 active:translate-y-0",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Polymorphic button. Renders an <a> when `href` is given, else a <button>.
 * Three brand variants; `accent` (blue) is the signature Refer CTA.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = [base, sizes[size], variants[variant], className]
    .filter(Boolean)
    .join(" ");

  if (typeof props.href === "string") {
    const { href, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type ?? "button"} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}

export default Button;
