import type { ElementType, ReactNode } from "react";

export interface ContainerProps {
  /** Render element (default <div>). */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

/**
 * Centered content column — ~1200px max with responsive gutters.
 */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  const classes = ["mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12", className]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes}>{children}</Tag>;
}

export default Container;
