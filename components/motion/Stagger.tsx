"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { StaggerContext } from "./StaggerContext";

export interface StaggerProps {
  children?: ReactNode;
  className?: string;
  /** Seconds between each child's reveal (default 0.1). */
  stagger?: number;
  /** Render element (default "div"). */
  as?: "div" | "ul" | "section";
}

/**
 * Reveals direct children in sequence as the group scrolls into view.
 *
 * Renders ONE parent `motion` element that drives `staggerChildren`. Children
 * must be `motion` elements (e.g. `<FadeUp>`) that share matching `variants`
 * keys — they are rendered DIRECTLY (no extra wrapper) so grid/flex layouts
 * and `<ul><li>` semantics are preserved.
 *
 * Honors prefers-reduced-motion: when reduced, renders a plain element with
 * its children unwrapped — NO transforms, no motion, no IntersectionObserver.
 */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  as = "div",
}: StaggerProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <StaggerContext.Provider value={true}>
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger } },
        }}
      >
        {children}
      </MotionTag>
    </StaggerContext.Provider>
  );
}

export default Stagger;
