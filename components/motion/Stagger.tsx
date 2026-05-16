"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, Variants } from "motion/react";
import { softSpring, staggerChildren } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

// Variants animate only `y`. Opacity is never gated on inView so content
// stays visible to non-scrolling viewers.
const parentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren },
  },
};

const itemVariants: Variants = {
  hidden: { y: 8 },
  visible: { y: 0, transition: softSpring },
};

export function Stagger({ children, className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={parentVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
