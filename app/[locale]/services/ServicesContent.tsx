"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { PillarCard } from "@/components/ui/PillarCard";
import { CtaBand } from "@/components/ui/CtaBand";
import { siteConfig } from "@/lib/site-config";

/**
 * /services — a short two-pillar hub (spec §6 Services hub, minus payer
 * content per client direction 2026-07-02). Routes into the dedicated
 * /services/skilled and /services/attendant pages. Intentionally short:
 * this is a router, not a detail page. No payer/program names anywhere
 * except the "Medicare-certified" credential on the skilled pillar card.
 */
export function ServicesContent() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");

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

      {/* 2. Two pillars */}
      <Section tone="light" id="pillars">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PillarCard
            eyebrow={t("pillars.skilled.eyebrow")}
            title={t("pillars.skilled.title")}
            description={t("pillars.skilled.description")}
            services={t.raw("pillars.skilled.services") as string[]}
            href="/services/skilled"
            cta={t("pillars.skilled.cta")}
          />
          <PillarCard
            eyebrow={t("pillars.attendant.eyebrow")}
            title={t("pillars.attendant.title")}
            description={t("pillars.attendant.description")}
            services={t.raw("pillars.attendant.services") as string[]}
            href="/services/attendant"
            cta={t("pillars.attendant.cta")}
          />
        </div>
      </Section>

      {/* 3. "Not sure which you need?" explainer */}
      <Section
        tone="sky"
        eyebrow={t("explainer.eyebrow")}
        title={t("explainer.title")}
        id="not-sure"
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-title text-navy">
              {t("explainer.skilled.title")}
            </h3>
            <p className="mt-3 leading-relaxed text-slate">{t("explainer.skilled.body")}</p>
          </div>
          <div>
            <h3 className="font-display text-title text-navy">
              {t("explainer.attendant.title")}
            </h3>
            <p className="mt-3 leading-relaxed text-slate">{t("explainer.attendant.body")}</p>
          </div>
        </div>
      </Section>

      {/* 4. Closing CTA */}
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
