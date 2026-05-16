import type { Transition } from "motion/react";

export const softSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
};

export const easeOut: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export const quickTap: Transition = {
  duration: 0.15,
  ease: "easeOut",
};

export const staggerChildren = 0.08;

// Per-word stagger for StaggerWords primitive (seconds between words).
// 100ms feels editorial without being slow — tuned via the brainstorm
// preview at this value.
export const staggerWords = 0.1;
