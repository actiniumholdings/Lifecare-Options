"use client";

import { motion } from "motion/react";
import { coverageCounties } from "@/lib/coverage-counties";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Stylized coverage diagram (not a geographic map): two soft county shapes
 * meeting at Katy, drawn in the warm palette. Cream separation strokes keep
 * the shapes readable on the peach-tint canvas.
 */
export function ServiceMap() {
  const reduced = useReducedMotionSafe();
  return (
    <figure
      role="img"
      aria-label="Lifecare Options coverage map: Harris and Fort Bend counties, meeting at Katy"
      className="w-full"
    >
      <svg viewBox="0 0 320 220" className="w-full rounded-2xl bg-peach-tint" aria-hidden>
        {/* Harris — upper right, soft organic shape */}
        <motion.path
          d="M150 32 C 196 14, 262 22, 288 56 C 306 82, 300 122, 268 140 C 238 156, 196 152, 172 134 C 148 116, 136 92, 138 68 C 139 52, 142 38, 150 32 Z"
          fill={coverageCounties[0].color}
          stroke="#FBF5EE"
          strokeWidth="3"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Fort Bend — lower left, interlocking */}
        <motion.path
          d="M36 104 C 62 78, 116 78, 148 100 C 176 120, 182 152, 160 176 C 136 200, 84 204, 52 184 C 24 166, 18 128, 36 104 Z"
          fill={coverageCounties[1].color}
          stroke="#FBF5EE"
          strokeWidth="3"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: reduced ? 0 : 0.15 }}
        />
        {/* Katy marker at the county seam */}
        <motion.g
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.45 }}
          style={{ transformOrigin: "152px 112px" }}
        >
          <circle cx="152" cy="112" r="9" fill="#F2C39B" stroke="#2E3A50" strokeWidth="2.5" />
          <circle cx="152" cy="112" r="3" fill="#2E3A50" />
          <text
            x="152"
            y="94"
            textAnchor="middle"
            fontFamily="var(--font-sans, sans-serif)"
            fontSize="13"
            fontWeight="700"
            fill="#2E3A50"
            stroke="#FBF5EE"
            strokeWidth="4"
            paintOrder="stroke"
          >
            Katy
          </text>
        </motion.g>
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-4">
        {coverageCounties.map((c) => (
          <span key={c.name} className="inline-flex items-center gap-2 text-sm text-white/70">
            <span className="h-3 w-3 rounded-sm ring-1 ring-white/40" style={{ background: c.color }} aria-hidden />
            {c.name}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
