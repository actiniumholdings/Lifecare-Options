"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

export function CareersContent() {
  const t = useTranslations("careers");
  const tCommon = useTranslations("common");

  const cultureCards = [
    { titleKey: "why.card1Title", bodyKey: "why.card1Body" },
    { titleKey: "why.card2Title", bodyKey: "why.card2Body" },
    { titleKey: "why.card3Title", bodyKey: "why.card3Body" },
    { titleKey: "why.card4Title", bodyKey: "why.card4Body" },
  ] as const;

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.primary"), href: "#apply" }}
        secondaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
        photoSrc="/images/therapy.jpg"
        photoAlt={t("hero.photoAlt")}
      />

      {/* 2. Why work here — light */}
      <Section tone="light">
        <Eyebrow>{t("why.eyebrow")}</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-snug text-navy sm:text-3xl">
          {t("why.title")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cultureCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white">
              <p className="font-semibold text-navy">{t(titleKey)}</p>
              <p className="mt-2 text-slate text-sm leading-relaxed">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Open roles — dark */}
      <Section tone="dark">
        <Eyebrow className="!text-sky-soft">{t("openRoles.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-mist">{t("openRoles.title")}</h2>
        {siteConfig.positions.length === 0 ? (
          <div className="mt-8 max-w-xl">
            <p className="text-lg font-semibold text-mist">{t("openRoles.emptyTitle")}</p>
            <p className="mt-3 text-slate/80 leading-relaxed">{t("openRoles.emptyBody")}</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {siteConfig.positions.map((pos) => (
              <li key={pos.title} className="text-mist">
                <span className="font-semibold">{pos.title}</span>
                {pos.type && <span className="ml-2 text-sm text-slate/70">{pos.type}</span>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* 4. How to apply — light, id="apply" */}
      <Section tone="light" id="apply">
        <Eyebrow>{t("apply.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold leading-snug text-navy sm:text-3xl">
          {t("apply.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-slate">{t("apply.body")}</p>
        <div className="mt-10">
          <LeadForm />
        </div>
      </Section>

      {/* 5. Bilingual welcome — dark */}
      <Section tone="dark">
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow className="!text-sky-soft">{t("bilingual.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-mist">{t("bilingual.title")}</h2>
          <p className="mt-4 text-slate/80 leading-relaxed">{t("bilingual.body")}</p>
        </div>
      </Section>

      {/* 6. CtaBand */}
      <CtaBand
        headline={t("cta.headline")}
        primary={{ label: t("hero.primary"), href: "#apply" }}
        secondary={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />
    </>
  );
}
