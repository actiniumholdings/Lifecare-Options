"use client";

import { motion } from "motion/react";
import { Heartbeat } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { easeOut } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Thin announcement band above the Nav. Navy surface gives architectural
 * contrast against the navy/sky-soft palette below (and bookends with the
 * navy footer). Single short message — keep the copy tight. Not sticky.
 */
export function AnnouncementBar() {
  const reduced = useReducedMotionSafe();
  const t = useTranslations("common");

  return (
    <motion.div
      role="region"
      aria-label="Announcement"
      className="bg-navy text-mist"
      initial={reduced ? { y: 0 } : { y: -4 }}
      animate={{ y: 0 }}
      transition={{ ...easeOut, duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm md:px-6">
        <Heartbeat
          size={18}
          weight="duotone"
          className="text-mist shrink-0"
          aria-hidden
        />
        <span className="font-medium">
          {t("announcement")}
        </span>
      </div>
    </motion.div>
  );
}
