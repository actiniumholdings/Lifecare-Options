"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type FadeUpProps = {
  children: ReactNode;
  delay?: number; // milliseconds
  className?: string;
};

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
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
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...easeOut, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
