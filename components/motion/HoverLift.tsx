"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { softSpring } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduced = useReducedMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(15, 43, 71, 0.12)" }}
      whileTap={{ scale: 0.98 }}
      transition={softSpring}
    >
      {children}
    </motion.div>
  );
}
