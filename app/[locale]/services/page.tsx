"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig, services } from "@/lib/site-config";
import type { ServiceIconName } from "@/lib/site-config";

export default function ServicesPage() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.primary"), href: "/contact" }}
        secondaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />

      {/* 2. Skilled Home Health pillar */}
      <Section tone="light" id="skilled-home-health">
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

      {/* 3. Specialties grid */}
      <Section tone="dark" id="specialties">
        <Eyebrow>{t("specialties.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-mist">{t("specialties.title")}</h2>
        <ul
          aria-label="Conditions we support"
          className="mt-10 flex flex-wrap gap-3"
        >
          {siteConfig.specialties.map((specialty) => (
            <li
              key={specialty}
              className="rounded-full border border-care-blue/40 bg-care-blue/10 px-4 py-2 text-sm font-medium text-mist"
            >
              {specialty}
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. Insurance & coverage */}
      <Section tone="light" id="insurance">
        <Eyebrow>{t("insurance.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("insurance.title")}</h2>
        <ul className="mt-8 space-y-2">
          {siteConfig.insurancePlans.map((plan) => (
            <li key={plan} className="flex items-center gap-3 text-navy">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-care-blue"
              />
              {plan}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-slate">{t("insurance.body")}</p>
      </Section>

      {/* 5. CTA Band */}
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
