import { useReducedMotion } from "motion/react";

/**
 * Single source of truth for reduced-motion preference across the app.
 * Wraps Framer's useReducedMotion (which can return null during SSR) so
 * callers get a strict boolean.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() === true;
}
