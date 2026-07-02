import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/motion/FadeUp";
import { BrandMotif } from "./BrandMotif";
import { siteConfig } from "@/lib/site-config";

/**
 * Closing navy CTA band. Centered, confident invitation to refer a patient or
 * contact the team, with the single Lifecare line reachable as a tel: link.
 * The brand mark watermarks the panel for cohesion.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <BrandMotif
        opacity={0.05}
        className="absolute -bottom-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-care-blue/40" />
      <Container className="relative py-20 text-center sm:py-28">
        <FadeUp>
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <Eyebrow tone="dark">Ready When You Are</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              Let&rsquo;s bring trusted care home
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Refer a patient in minutes, or reach out and we&rsquo;ll walk you
              through every option — with {siteConfig.onCall} whenever you need us.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="accent" size="lg" href="/refer">
                Refer a Patient
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/contact"
                className="border-white/30 text-white hover:border-white/50 hover:bg-white/[0.06]"
              >
                Contact Us
              </Button>
            </div>

            {/* Single Lifecare line, reachable as a tel: link. */}
            <div className="mt-10 flex flex-col items-center leading-tight">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                Call us directly
              </span>
              <a
                href={siteConfig.phoneHref}
                className="mt-1 font-display text-3xl font-semibold tabular-nums text-white transition-colors hover:text-blue-light"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

export default FinalCTA;
