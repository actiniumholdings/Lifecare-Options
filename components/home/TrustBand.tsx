"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";
import { BrandMotif } from "./BrandMotif";

export interface StatPlan {
  prefix: string;
  target: number;
  suffix: string;
  tail: string;
}

/**
 * Parses a stat value into a count-up plan.
 * - "18", "100%", "9" → counts with an optional prefix/suffix.
 * - "24/7" → counts the integer ("24") and reveals the tail ("/7") at the end.
 * - Anything else → null (rendered statically).
 */
export function parseStat(value: string): StatPlan | null {
  let m = value.match(/^(\D*)(\d+)([%+]?)$/);
  if (m) return { prefix: m[1] ?? "", target: parseInt(m[2] ?? "0", 10), suffix: m[3] ?? "", tail: "" };
  m = value.match(/^(\D*)(\d+)(\D.*)$/);
  if (m) return { prefix: m[1] ?? "", target: parseInt(m[2] ?? "0", 10), suffix: "", tail: m[3] ?? "" };
  return null;
}

/**
 * A single trust stat. The numeric head counts up from 0 on scroll-in; a complex
 * tail like "/7" fades up once the count lands. Reduced-motion / non-countable
 * values render their final value immediately.
 */
export function CountStat({
  value,
  label,
  inView,
}: {
  value: string;
  label: string;
  inView: boolean;
}) {
  const reduced = useReducedMotion();
  const plan = useMemo(() => parseStat(value), [value]);
  const animate = !!plan && !reduced;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate || !inView || !plan) return;
    let frame = 0;
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setCount(Math.round(eased * plan.target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, inView, plan]);

  const tailVisible = reduced || inView;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-5xl font-semibold leading-none tracking-tight text-care-blue whitespace-nowrap sm:text-6xl">
        {plan ? `${plan.prefix}${animate ? count : plan.target}${plan.suffix}` : value}
        {plan?.tail && (
          <motion.span
            className="inline-block"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: tailVisible ? 1 : 0, y: tailVisible ? 0 : 8 }}
            transition={{
              delay: reduced ? 0 : 0.9,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {plan.tail}
          </motion.span>
        )}
      </span>
      <span className="font-sans text-sm font-medium uppercase tracking-[0.08em] text-white/70">
        {label}
      </span>
    </div>
  );
}

/**
 * Premium navy trust band. License + service-area framing, then a row of stat
 * counters that count up once on scroll-in. Numbers are illustrative and
 * generically labeled — NO invented patient counts.
 */
export function TrustBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  const stats: { value: string; label: string }[] = [
    { value: `${years}`, label: "Years serving Katy" },
    { value: "7", label: "Disciplines of care" },
    { value: "24/7", label: "On-call nursing" },
    { value: `${siteConfig.serviceArea.cities.length}`, label: "Cities served" },
  ];

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <BrandMotif
        opacity={0.05}
        className="absolute -right-24 -top-24 h-[480px] w-[480px]"
      />
      {/* Top blue hairline rule */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-care-blue/40" />
      <Container className="relative py-16 sm:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left: license + service-area framing */}
          <div className="max-w-md">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-peach">
              Licensed by the State of Texas
            </p>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">
              Trusted, accountable care across Katy &amp; West Houston
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {siteConfig.accreditation}
              {siteConfig.stateLicense
                ? `, Texas License Number ${siteConfig.stateLicense}. `
                : ". "}
              Skilled home health and attendant care, coordinated with your
              physician and your family, every step of the way.
            </p>
          </div>

          {/* Right: animated stats */}
          <motion.div
            ref={ref}
            className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 lg:gap-x-12"
          >
            {stats.map((s) => (
              <CountStat key={s.label} {...s} inView={inView} />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default TrustBand;
