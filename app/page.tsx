"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Eyebrow } from "@/components/Eyebrow";
import { TrustBadge } from "@/components/TrustBadge";
import { TrustTicker } from "@/components/TrustTicker";
import { ServicesGrid } from "@/components/ServicesGrid";
import { MissionBand } from "@/components/MissionBand";
import { LeadForm } from "@/components/LeadForm";
import { HeroIllustration } from "@/components/HeroIllustration";
import { FadeUp } from "@/components/motion/FadeUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { siteConfig, services } from "@/lib/site-config";

function Hero() {
  const yearsServing = new Date().getFullYear() - siteConfig.foundedYear;

  const stats: Array<[string, string]> = [
    [String(yearsServing), "years serving Katy"],
    [String(services.length), "care disciplines"],
    ["24/7", "on-call nursing"],
  ];

  return (
    <section id="top" className="relative overflow-hidden px-4 md:px-6">
      {/* Watercolor washes — purely decorative */}
      <div
        aria-hidden
        className="bg-peach/95 pointer-events-none absolute -top-44 -right-36 h-[40rem] w-[40rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-borderline/90 pointer-events-none absolute -bottom-56 -left-40 h-[35rem] w-[35rem] rounded-full blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 py-14 md:grid-cols-[1.15fr_1fr] md:gap-16 md:py-24">
        <div>
          <FadeUp>
            <Eyebrow>Home Health · Katy, TX</Eyebrow>
          </FadeUp>

          <FadeUp delay={80}>
            <h1 className="mt-5">
              Quality care,
              <br />
              <em className="text-care-blue font-normal italic">
                felt at home.
              </em>
            </h1>
          </FadeUp>

          <FadeUp delay={160}>
            <p className="text-slate mt-6 max-w-lg text-lg leading-relaxed">
              Medicare-certified skilled nursing, therapy, and personal care,
              delivered across Katy, Fort Bend, and Harris counties since{" "}
              {siteConfig.foundedYear}.
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" href="/#contact">
                Request info →
              </Button>
              <Button size="lg" variant="secondary" href={siteConfig.phoneHref}>
                <Phone size={16} />
                Call {siteConfig.phone}
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={320}>
            <dl className="mt-11 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="font-display block text-3xl">{value}</span>
                    <span className="text-slate mt-0.5 block text-xs">
                      {label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </div>

        {/* Arch panel. The media inside is the real photo/video — the
            accessibility statement promises reduced-motion visitors a still
            image here, so this must stay a real <HeroIllustration>. */}
        <FadeUp delay={200}>
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div
              aria-hidden
              className="border-peach-deep pointer-events-none absolute -inset-x-4 -top-4 bottom-4 rounded-t-[15rem] rounded-b-2xl border-[1.5px]"
            />
            <div className="from-borderline via-peach to-peach-deep relative aspect-4/5 overflow-hidden rounded-t-[14rem] rounded-b-2xl bg-linear-160 from-0% via-55% to-100%">
              <HeroIllustration className="absolute inset-0 h-full w-full object-cover" />

              <div className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/92 px-5 py-4 shadow-[0_18px_40px_-18px_rgba(15,43,71,0.28)] backdrop-blur-xs">
                <span
                  aria-hidden
                  className="bg-success-bg text-success-green inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                >
                  ✓
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    Medicare-certified
                  </span>
                  <span className="text-slate block text-xs">
                    + {siteConfig.accreditation} agency
                  </span>
                </span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white px-4 py-16 md:px-6 md:py-26">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-18">
        <div>
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="mt-4">
            Serving Katy families{" "}
            <em className="text-care-blue font-normal italic">since 2008.</em>
          </h2>
          <FadeUp delay={120}>
            <p className="text-slate mt-6 leading-relaxed">
              <span className="font-display text-care-blue float-left pt-1.5 pr-3 text-6xl leading-[0.9]">
                W
              </span>
              e&apos;re a CHAP-accredited, Medicare-certified home health
              agency, locally owned and small enough to know your name. Our
              clinicians bring skilled care into the home, where healing is most
              natural, and we&apos;re on-call 24/7 for whatever comes next.
            </p>
          </FadeUp>
        </div>

        <div className="bg-cream border-borderline rounded-tl-2xl rounded-tr-[7.5rem] rounded-b-2xl border p-8 md:p-10">
          <h3 className="mb-5">Why families choose us</h3>
          <Stagger className="flex flex-wrap gap-2">
            <StaggerItem>
              <TrustBadge>Medicare-certified</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>{siteConfig.accreditation}</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>
                Serving Katy since {siteConfig.foundedYear}
              </TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>24/7 on-call</TrustBadge>
            </StaggerItem>
            <StaggerItem>
              <TrustBadge>Locally owned</TrustBadge>
            </StaggerItem>
          </Stagger>
          <p className="text-slate mt-6 text-sm leading-relaxed">
            From referral to first visit, usually within 48 hours.
          </p>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 py-16 md:px-6 md:py-26"
    >
      <div
        aria-hidden
        className="bg-peach/90 pointer-events-none absolute -right-32 -bottom-44 h-[32rem] w-[32rem] rounded-full blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <Eyebrow flanked>Get in touch</Eyebrow>
          <h2 className="mt-4">
            Ready to bring{" "}
            <em className="text-care-blue font-normal italic">care home?</em>
          </h2>
          <p className="text-slate mt-4 leading-relaxed">
            Send us a note below, or call{" "}
            <a
              href={siteConfig.phoneHref}
              className="text-navy hover:text-care-blue font-semibold"
            >
              {siteConfig.phone}
            </a>
            . Our line is answered by a person.
          </p>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustTicker />
      <About />
      <ServicesGrid />
      <MissionBand />
      <Contact />
    </>
  );
}
