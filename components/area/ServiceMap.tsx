"use client";

import { motion } from "motion/react";
import { coverageCounties } from "@/lib/coverage-counties";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export function ServiceMap() {
  const reduced = useReducedMotionSafe();
  return (
    <figure role="img" aria-label="Lifecare Options coverage map: Harris and Fort Bend counties" className="w-full">
      <svg viewBox="0 0 320 220" className="w-full rounded-2xl bg-peach-tint" aria-hidden>
        {/* Harris — top-right block */}
        <motion.rect
          x="150" y="20" width="150" height="120" rx="10"
          fill={coverageCounties[0].color}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Fort Bend — bottom-left block */}
        <motion.rect
          x="20" y="90" width="150" height="110" rx="10"
          fill={coverageCounties[1].color}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 0.2 }}
        />
        {/* Katy pin at the county overlap */}
        <circle cx="150" cy="110" r="7" fill="#fdeedd" stroke="#0f2b47" strokeWidth="2" />
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-4">
        {coverageCounties.map((c) => (
          <span key={c.name} className="inline-flex items-center gap-2 text-sm text-white/70">
            <span className="h-3 w-3 rounded-sm" style={{ background: c.color }} aria-hidden />
            {c.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
