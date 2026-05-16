"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "motion/react";
import { softSpring, staggerWords as staggerWordsToken } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type StaggerWordsProps = {
  /** Text to render. String = one line. String[] = lines separated by <br/>. */
  text: string | string[];
  /** Semantic element tag. Default "h1". */
  as?: "h1" | "h2" | "h3";
  /** Per-word stagger interval in ms. Default 100. */
  stagger?: number;
  /** Initial delay before the first word in ms. Default 0. */
  delay?: number;
  /** "load" = animate on mount. "in-view" = animate when 20% scrolled in. */
  trigger?: "load" | "in-view";
  className?: string;
};

export function StaggerWords({
  text,
  as = "h1",
  stagger = staggerWordsToken * 1000,
  delay = 0,
  trigger = "in-view",
  className,
}: StaggerWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionSafe();

  const lines = Array.isArray(text) ? text : [text];
  const shouldAnimate = !reduced && (trigger === "load" || inView);

  // Build a flat list of word tokens with their global index, preserving
  // line breaks between array entries.
  let wordIndex = 0;
  const children = lines.flatMap((line, lineIdx) => {
    const words = line.split(/\s+/).filter(Boolean);
    const lineNodes = words.map((word, i) => {
      const isLast = i === words.length - 1;
      const idx = wordIndex++;
      return (
        <Fragment key={`l${lineIdx}w${i}`}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={
              shouldAnimate
                ? { opacity: 1, y: 0 }
                : reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
            }
            transition={{
              ...softSpring,
              delay: (delay + idx * stagger) / 1000,
            }}
          >
            {word}
          </motion.span>
          {!isLast && " "}
        </Fragment>
      );
    });
    return lineIdx < lines.length - 1
      ? [...lineNodes, <br key={`br${lineIdx}`} />]
      : lineNodes;
  });

  // Switch on `as` to keep ref typing tight; passing refs through
  // createElement triggers react-hooks/refs.
  if (as === "h2") {
    return <h2 ref={ref} className={className}>{children}</h2>;
  }
  if (as === "h3") {
    return <h3 ref={ref} className={className}>{children}</h3>;
  }
  return <h1 ref={ref} className={className}>{children}</h1>;
}
