"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StepList } from "@/components/ui/StepList";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig, services } from "@/lib/site-config";
import type { ServiceIconName } from "@/lib/site-config";

/**
 * /services/skilled — Skilled Home Health pillar (spec §6, minus payer/
 * insurance content per client direction 2026-07-02). Where coverage would
 * be discussed, only a soft "we’ll walk you through coverage" line is used.
 */
export function SkilledContent() {
  const t = useTranslations("skilled");
  const tCommon = useTranslations("common");

  const startSteps = [
    { title: t("start.step1.title"), body: t("start.step1.body") },
    { title: t("start.step2.title"), body: t("start.step2.body") },
    { title: t("start.step3.title"), body: t("start.step3.body") },
  ];

  return (
    <>
      {/* 1. Interior hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.primary"), href: "/contact" }}
        secondaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
        photoSrc="/images/hero-care.jpg"
        photoAlt="A Lifecare nurse smiles with an elderly patient during a home visit."
      />

      {/* 2. Seven discipline cards */}
      <Section tone="light" id="disciplines">
        <Eyebrow>{t("pillar.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("pillar.title")}</h2>
        <p className="mt-4 max-w-2xl text-slate">{t("pillar.body")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.iconName} variant="white" className="text-navy">
              <p className="font-semibold text-navy">{service.name}</p>
              <p className="mt-2 text-sm text-slate">
                {t(`detail.${service.iconName}` as `detail.${ServiceIconName}`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Conditions We Support — readable white-on-navy chips */}
      <Section tone="dark" id="conditions">
        <Eyebrow tone="dark">{t("conditions.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-white">{t("conditions.title")}</h2>
        <ul
          aria-label="Conditions we support"
          className="mt-10 flex flex-wrap gap-3"
        >
          {siteConfig.specialties.map((specialty) => (
            <li
              key={specialty}
              className="rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white"
            >
              {specialty}
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. How care starts */}
      <Section
        tone="light"
        eyebrow={t("start.eyebrow")}
        title={t("start.title")}
        intro={t("start.intro")}
        id="how-care-starts"
      >
        <StepList steps={startSteps} />
        <p className="mt-10 max-w-2xl text-sm text-slate">{t("cta.note")}</p>
      </Section>

      {/* 5. Closing CTA — no payer names */}
      <CtaBand
        headline={t("cta.headline")}
        primary={{ label: t("cta.primary"), href: "/contact" }}
        secondary={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />
    </>
  );
}
