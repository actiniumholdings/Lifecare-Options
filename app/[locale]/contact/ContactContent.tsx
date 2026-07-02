"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

export function ContactContent() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const { street, city, state, zip } = siteConfig.address;

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.primary"), href: "#contact" }}
        secondaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
        photoSrc="/images/coordinator.jpg"
        photoAlt={t("hero.photoAlt")}
      />

      {/* 2. Details + map — 2-col */}
      <Section tone="light">
        <Eyebrow>{t("details.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("details.title")}
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left — contact cards */}
          <div className="flex flex-col gap-4">
            <Card variant="white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                {t("details.phone")}
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-1 block text-lg font-semibold text-navy hover:text-blue-deep"
              >
                {siteConfig.phone}
              </a>
            </Card>

            <Card variant="white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                {t("details.fax")}
              </p>
              <p className="mt-1 text-lg font-semibold text-navy">
                {siteConfig.fax}
              </p>
            </Card>

            <Card variant="white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                {t("details.email")}
              </p>
              <a
                href={`mailto:${siteConfig.intakeEmail}`}
                className="mt-1 block text-base font-semibold text-navy hover:text-blue-deep break-all"
              >
                {siteConfig.intakeEmail}
              </a>
            </Card>

            <Card variant="white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                {t("details.address")}
              </p>
              <address className="mt-1 not-italic text-navy font-semibold">
                {street}
                <br />
                {city}, {state} {zip}
              </address>
            </Card>

            <Card variant="white">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate">
                {t("details.hours")}
              </p>
              <ul className="mt-2 space-y-1">
                {siteConfig.hours.map((h) => (
                  <li key={h.days} className="flex gap-4 text-sm text-navy">
                    <span className="w-20 font-semibold shrink-0">{h.days}</span>
                    <span className="text-slate">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate">{t("details.onCall")}</p>
            </Card>
          </div>

          {/* Right — Google Maps embed */}
          <div className="lg:sticky lg:top-8">
            <iframe
              src="https://www.google.com/maps?q=434+Park+Grove+Dr,+Katy,+TX+77450&output=embed"
              title={t("map.title")}
              loading="lazy"
              className="h-72 w-full rounded-2xl border-0 lg:h-[500px]"
              aria-label={t("map.title")}
            />
          </div>
        </div>
      </Section>

      {/* 3. Contact form — anchored at #contact */}
      <Section tone="light" id="contact">
        <Eyebrow>{t("form.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("form.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-slate">{t("form.body")}</p>
        <div className="mt-10">
          <LeadForm />
        </div>
      </Section>

      {/* 4. CtaBand */}
      <CtaBand
        headline={t("cta.headline")}
        primary={{
          label: t("hero.primary"),
          href: "#contact",
        }}
        secondary={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />
    </>
  );
}
