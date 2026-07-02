import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneIcon } from "@/components/ui/icons";
import { FadeUp } from "@/components/motion/FadeUp";
import { siteConfig } from "@/lib/site-config";

/**
 * Flagship hero. A bespoke layout (NOT the Section primitive) so it can own the
 * single page <h1> — a small brand kicker plus a confident Fraunces statement.
 * Editorial split: copy + CTAs on the left, a warm caregiver photograph on the
 * right. Mirrors Central's home hero, in Lifecare's identity.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      {/* Soft radial wash behind the hero for depth (not a flat field). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_90%_at_85%_-10%,rgba(90,139,184,0.14),transparent_55%),radial-gradient(90%_70%_at_-10%_110%,rgba(13,43,73,0.06),transparent_60%)]"
      />
      <Container className="relative grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-32">
        {/* Left: copy + CTAs */}
        <div>
          <FadeUp>
            <Eyebrow>Compassionate In-Home Care · Katy, Texas</Eyebrow>
          </FadeUp>

          <FadeUp delay={0.05}>
            <h1 className="mt-6 font-display font-semibold tracking-tight text-navy">
              <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-blue-deep sm:text-[0.95rem]">
                {siteConfig.name}
              </span>
              <span className="mt-4 block text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
                Expert care, delivered with warmth, right where home is.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-slate">
              Skilled nursing, therapy, and personal home health care for
              families across Katy, Fort Bend, and Harris counties. Licensed
              professionals who coordinate with your physician and keep the focus
              on dignity and independence at home.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="primary" size="lg" href="/refer">
                Refer a Patient
              </Button>
              <Button variant="secondary" size="lg" href={siteConfig.phoneHref}>
                <PhoneIcon className="h-4 w-4" />
                Call {siteConfig.phone}
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-6 text-sm text-slate/90">
              {siteConfig.accreditation}
              {siteConfig.stateLicense && (
                <>
                  <span className="mx-2 text-navy/20" aria-hidden="true">
                    |
                  </span>
                  Texas License Number&nbsp;{siteConfig.stateLicense}
                </>
              )}
            </p>
          </FadeUp>
        </div>

        {/* Right: hero photograph. */}
        <FadeUp delay={0.1} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)] shadow-[0_30px_80px_-30px_rgba(8,29,51,0.55)] ring-1 ring-navy/10">
            <Image
              src="/images/hero-care.jpg"
              alt="A Lifecare Options caregiver sharing a warm moment with an older client at home"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            {/* Legibility wash so the caption chip stays readable over the photo */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/10 to-transparent"
            />
            {/* Blue hairline frame accent */}
            <div
              aria-hidden="true"
              className="absolute inset-5 rounded-[var(--radius)] border border-care-blue/30"
            />
            {/* Caption chip — reads as an intentional composition. */}
            <div className="absolute inset-x-6 bottom-6 rounded-[var(--radius)] border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-sm">
              <p className="font-display text-lg font-semibold leading-snug text-white">
                Care that comes to you
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                Skilled home health, coordinated and delivered where you&rsquo;re
                most comfortable.
              </p>
            </div>
          </div>
          {/* Floating blue accent dot for editorial polish */}
          <span
            aria-hidden="true"
            className="absolute -left-3 top-10 hidden h-16 w-1 rounded-full bg-care-blue lg:block"
          />
        </FadeUp>
      </Container>
    </section>
  );
}

export default Hero;
