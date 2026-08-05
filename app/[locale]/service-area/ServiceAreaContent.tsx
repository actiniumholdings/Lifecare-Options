"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { ServiceMap } from "@/components/area/ServiceMap";
import { siteConfig } from "@/lib/site-config";

export function ServiceAreaContent() {
  const t = useTranslations("serviceArea");
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
        photoSrc="/images/arrival.jpg"
        photoAlt={t("hero.photoAlt")}
      />

      {/* 2. Counties strip — light */}
      <Section tone="light">
        <Eyebrow>{t("counties.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("counties.title")}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-6">
          {siteConfig.serviceArea.counties.map((county) => (
            <li key={county.name} className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-sm"
                style={{ background: county.color }}
                aria-hidden
              />
              <span className="font-semibold text-navy">{county.name}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Cities grid — light */}
      <Section tone="light">
        <Eyebrow>{t("cities.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("cities.title")}
        </h2>
        <ul
          aria-label={t("cities.ariaLabel")}
          className="mt-8 flex flex-wrap gap-2"
        >
          {siteConfig.serviceArea.cities.map((city) => (
            <li
              key={city}
              className="rounded-full border border-care-blue/30 bg-care-blue/10 px-4 py-1.5 text-sm font-medium text-navy"
            >
              {city}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-slate">{t("cities.note")}</p>
      </Section>

      {/* 4. Map — dark */}
      <Section tone="dark">
        <Eyebrow className="!text-peach-tint">{t("map.eyebrow")}</Eyebrow>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
          <ServiceMap />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold text-white">{t("map.callout")}</p>
            <a
              href={siteConfig.phoneHref}
              className="mt-3 text-peach-tint hover:underline"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </Section>

      {/* 5. CtaBand */}
      <CtaBand
        headline={t("cta.headline")}
        primary={{ label: tCommon("requestInfo"), href: "/contact" }}
        secondary={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />
    </>
  );
}
