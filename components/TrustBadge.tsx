"use client";

import { motion } from "motion/react";
import { softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function TrustBadge({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotionSafe();

  const base =
    "inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-medium text-success-green";

  if (reduced) {
    return (
      <span className={base}>
        <span aria-hidden>✓</span>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={base}
      whileHover={{ scale: 1.04, backgroundColor: "#d9ebde" }}
      transition={softSpring}
    >
      <span aria-hidden>✓</span>
      {children}
    </motion.span>
  );
}
