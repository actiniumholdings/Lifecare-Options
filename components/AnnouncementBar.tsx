"use client";

import { motion } from "motion/react";
import { Heartbeat } from "@phosphor-icons/react";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Thin announcement band above the Nav. Uses the brand's peach-cream
 * surface for warmth without reading as a typical promotional banner.
 * Single short message — keep the copy tight. Not sticky; scrolls
 * away with the page so it doesn't permanently occupy chrome.
 */
export function AnnouncementBar() {
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      className="bg-peach-cream border-borderline border-b"
      initial={reduced ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...easeOut, duration: 0.4 }}
    >
      <div className="text-navy mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm md:px-6">
        <Heartbeat
          size={18}
          weight="duotone"
          className="text-care-blue shrink-0"
          aria-hidden
        />
        <span className="font-medium">
          Now offering Remote Patient Monitoring.
        </span>
      </div>
    </motion.div>
  );
}
