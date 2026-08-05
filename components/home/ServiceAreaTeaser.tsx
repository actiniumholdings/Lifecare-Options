import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/Button";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger } from "@/components/motion/Stagger";
import { siteConfig } from "@/lib/site-config";

/**
 * Service-area teaser. A two-column editorial split: framing copy + CTA on the
 * left, a tasteful grid of city pills on the right that links to the full
 * /service-area page.
 */
export function ServiceAreaTeaser() {
  const cities = siteConfig.serviceArea.cities;

  return (
    <Section tone="light" id="service-area">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left: framing + CTA */}
        <FadeUp>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-blue-deep">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-6 align-middle bg-current opacity-60" />
            Where We Serve
          </p>
          <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight text-balance text-navy sm:text-4xl">
            Across Katy &amp; West Houston
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-slate">
            From Katy out to the surrounding suburbs, our team brings skilled and
            personal home health to families throughout Harris and Fort Bend
            counties.
          </p>
          <div className="mt-8">
            <Button variant="primary" href="/service-area">
              See our full service area
            </Button>
          </div>
        </FadeUp>

        {/* Right: city pills */}
        <FadeUp delay={0.08}>
          <Stagger className="flex flex-wrap gap-3" stagger={0.04}>
            {cities.map((city) => (
              <FadeUp as="span" key={city} distance={12}>
                <Link
                  href="/service-area"
                  className="inline-flex items-center rounded-full border border-navy/15 bg-card px-4 py-2 text-sm font-medium text-navy shadow-[0_1px_2px_rgba(13,43,73,0.04)] transition-colors hover:border-care-blue/50 hover:text-blue-deep"
                >
                  {city}
                </Link>
              </FadeUp>
            ))}
            <span className="inline-flex items-center rounded-full border border-dashed border-navy/20 px-4 py-2 text-sm font-medium text-slate">
              + more
            </span>
          </Stagger>
        </FadeUp>
      </div>
    </Section>
  );
}

export default ServiceAreaTeaser;
