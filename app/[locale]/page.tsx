"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";
import { ServicesList } from "@/components/ServicesList";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const t = useTranslations("home");
  return (
    <>
      {/* 1. Hero — uses new primitive; h1 rendered once inside Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={
          <>
            {t("hero.headline1")}
            <br />
            {t("hero.headline2")}
          </>
        }
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.ctaRequest"), href: "#contact" }}
        secondaryCta={{
          label: t("hero.ctaCall", { phone: siteConfig.phone }),
          href: siteConfig.phoneHref,
        }}
      />

      {/* 2. Trust stats strip */}
      <Section tone="light" id="trust" className="!py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat
            value={String(siteConfig.foundedYear)}
            label={t("trust.since")}
          />
          <Stat
            value={t("trust.medicareValue")}
            label={t("trust.medicareLabel")}
          />
          <Stat
            value={t("trust.chapValue")}
            label={t("trust.chapLabel")}
          />
          <Stat
            value={t("trust.oncallValue")}
            label={t("trust.oncallLabel")}
          />
        </div>
      </Section>

      {/* 3. Services — reuses existing ServicesList component */}
      <Section tone="light" id="services">
        <ServicesList />
      </Section>

      {/* 4–10. Plan 2 sections — stubbed; full copy + layout built in Plan 2 */}

      <Section tone="light" id="how-it-works">
        <h2>How It Works</h2>
        {/* Plan 2 fills: step-by-step process explanation */}
      </Section>

      <Section tone="light" id="why-lifecare">
        <h2>Why Lifecare</h2>
        {/* Plan 2 fills: differentiators, credentials, local story */}
      </Section>

      <Section tone="dark" id="service-area">
        <h2>Service Area</h2>
        {/* Plan 2 fills: county map + coverage details */}
      </Section>

      <Section tone="light" id="testimonials">
        <h2>What Families Say</h2>
        {/* Plan 2 fills: patient/family testimonials */}
      </Section>

      <Section tone="light" id="careers-teaser">
        <h2>Join Our Team</h2>
        {/* Plan 2 fills: careers teaser + CTA to jobs page */}
      </Section>

      <Section tone="dark" id="final-cta">
        <h2>Ready to Get Started?</h2>
        {/* Plan 2 fills: final conversion CTA band */}
      </Section>

      {/* 11. Lead capture form */}
      <Section tone="light" id="contact">
        <LeadForm />
      </Section>
    </>
  );
}
