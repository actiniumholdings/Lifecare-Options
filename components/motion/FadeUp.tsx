"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useInStagger } from "./StaggerContext";

export interface FadeUpProps {
  children?: ReactNode;
  className?: string;
  /** Stagger delay (seconds) when used as a standalone manual sequence. */
  delay?: number;
  /** Travel distance in px before settling (default 24). */
  distance?: number;
  /** Render element (default "div"). */
  as?: "div" | "section" | "li" | "article" | "span";
}

/** Shared variants so the key names match between Stagger parent and FadeUp children. */
export const fadeUpVariants = (distance: number) => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
});

/**
 * Fades + slides its children up as they scroll into view, once.
 *
 * Standalone usage: manages its own viewport trigger via `whileInView`.
 * Inside `<Stagger>`: inherits the parent's cascade via shared `variants` keys
 * — omits its own initial/whileInView so the parent drives the sequence.
 *
 * Honors prefers-reduced-motion: when reduced, renders a plain element with
 * NO transform and no animation (and no IntersectionObserver dependency).
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  distance = 24,
  as = "div",
}: FadeUpProps) {
  const reduced = useReducedMotion();
  const inStagger = useInStagger();

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];
  const variants = fadeUpVariants(distance);

  if (inStagger) {
    // Participate in parent's staggerChildren cascade: share variants, no own trigger.
    return (
      <MotionTag className={className} variants={variants}>
        {children}
      </MotionTag>
    );
  }

  // Standalone: self-managed viewport trigger.
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export default FadeUp;
