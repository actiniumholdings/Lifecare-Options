"use client";

import { motion } from "motion/react";
import { Heartbeat } from "@phosphor-icons/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Thin announcement band above the Nav. Navy surface gives architectural
 * contrast against the peach-cream brand below (and bookends with the
 * navy footer). Single short message — keep the copy tight. Not sticky.
 */
export function AnnouncementBar() {
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      className="bg-navy text-cream"
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...easeOut, duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm md:px-6">
        <Heartbeat
          size={18}
          weight="duotone"
          className="text-cream shrink-0"
          aria-hidden
        />
        <span className="font-medium">
          Now offering Remote Patient Monitoring.
        </span>
      </div>
    </motion.div>
  );
}
