"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig } from "@/lib/site-config";

export function ReferContent() {
  const t = useTranslations("refer");
  const tCommon = useTranslations("common");

  const whoCards = [
    { titleKey: "who.card1Title", bodyKey: "who.card1Body" },
    { titleKey: "who.card2Title", bodyKey: "who.card2Body" },
    { titleKey: "who.card3Title", bodyKey: "who.card3Body" },
    { titleKey: "who.card4Title", bodyKey: "who.card4Body" },
  ] as const;

  const steps = [
    t("next.step1"),
    t("next.step2"),
    t("next.step3"),
    t("next.step4"),
    t("next.step5"),
  ];

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
        secondaryCta={{ label: tCommon("requestInfo"), href: "/contact" }}
        photoSrc="/images/arrival.jpg"
        photoAlt={t("hero.photoAlt")}
      />

      {/* 2. Two ways to refer — light */}
      <Section tone="light">
        <Eyebrow>{t("ways.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("ways.title")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Call intake */}
          <Card variant="white">
            <p className="font-semibold text-navy">{t("ways.callTitle")}</p>
            <p className="mt-2 text-slate text-sm leading-relaxed">
              {t("ways.callBody")}
            </p>
            <a
              href={siteConfig.phoneHref}
              className="mt-4 block text-care-blue font-semibold hover:underline"
              aria-label={tCommon("callUs") + " " + siteConfig.phone}
            >
              {siteConfig.phone}
            </a>
          </Card>

          {/* Fax */}
          <Card variant="white">
            <p className="font-semibold text-navy">{t("ways.faxTitle")}</p>
            <p className="mt-2 text-slate text-sm leading-relaxed">
              {t("ways.faxBody")}
            </p>
            <p className="mt-4 text-care-blue font-semibold">{siteConfig.fax}</p>
          </Card>
        </div>
      </Section>

      {/* 3. What happens next — dark */}
      <Section tone="dark">
        <Eyebrow className="!text-care-blue/80">{t("next.eyebrow")}</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-mist">{t("next.title")}</h2>
        <ol
          className="mt-10 space-y-5"
          aria-label={t("next.eyebrow")}
        >
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                aria-hidden
                className="flex-shrink-0 w-7 h-7 rounded-full bg-care-blue/20 text-care-blue text-sm font-bold flex items-center justify-center"
              >
                {i + 1}
              </span>
              <p className="text-mist/90 leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Who can refer — light */}
      <Section tone="light">
        <Eyebrow>{t("who.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("who.title")}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whoCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white">
              <p className="font-semibold text-navy">{t(titleKey)}</p>
              <p className="mt-2 text-slate text-sm leading-relaxed">
                {t(bodyKey)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. CtaBand */}
      <CtaBand
        headline={t("cta.headline")}
        primary={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
        secondary={{ label: tCommon("requestInfo"), href: "/contact" }}
      />
    </>
  );
}
