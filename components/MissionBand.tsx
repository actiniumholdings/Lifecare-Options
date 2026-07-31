import { siteConfig } from "@/lib/site-config";

/**
 * Navy pull-quote band. The design kit put an invented patient testimonial
 * here ("Sarah M., daughter of patient"). Publishing a fabricated consumer
 * testimonial is prohibited by the FTC's Rule on Consumer Reviews and
 * Testimonials (16 CFR Part 465), so this states the agency's own care
 * philosophy in its own voice instead — a first-person claim needs no
 * substantiation and attributes nothing to a patient.
 *
 * If a real family testimonial is ever supplied, it needs written HIPAA
 * authorization (45 CFR 164.508) before it can replace this.
 */
export function MissionBand() {
  return (
    <section className="bg-navy relative overflow-hidden px-4 py-16 md:px-6 md:py-24">
      <div
        aria-hidden
        className="bg-care-blue/15 pointer-events-none absolute -top-24 -right-20 h-[26rem] w-[26rem] rounded-full"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <div
          aria-hidden
          className="font-display text-peach/65 text-[6rem] leading-[0.4]"
        >
          &ldquo;
        </div>
        <blockquote className="font-display text-peach mt-5 text-2xl leading-snug italic md:text-3xl">
          Healing happens best where life already is. We bring the clinic to the
          kitchen table, the bedside, the back porch — and we stay until the
          people we serve are steady on their own.
        </blockquote>
        <div className="text-peach/70 mt-6 text-sm not-italic">
          {siteConfig.name} · {siteConfig.address.city}, {siteConfig.address.state}
        </div>
      </div>
    </section>
  );
}
