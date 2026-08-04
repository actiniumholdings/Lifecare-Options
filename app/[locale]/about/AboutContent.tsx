"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Band } from "@/components/ui/Band";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig } from "@/lib/site-config";

export function AboutContent() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  const valueCards = [
    { titleKey: "values.card1Title", bodyKey: "values.card1Body" },
    { titleKey: "values.card2Title", bodyKey: "values.card2Body" },
    { titleKey: "values.card3Title", bodyKey: "values.card3Body" },
    { titleKey: "values.card4Title", bodyKey: "values.card4Body" },
  ] as const;

  const credentialCards = [
    { titleKey: "credentials.chapTitle", bodyKey: "credentials.chapBody" },
    { titleKey: "credentials.medicareTitle", bodyKey: "credentials.medicareBody" },
    { titleKey: "credentials.licenseTitle", bodyKey: "credentials.licenseBody" },
    { titleKey: "credentials.sinceFoundedTitle", bodyKey: "credentials.sinceFoundedBody" },
  ] as const;

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
        photoSrc="/images/vitals.jpg"
        photoAlt={t("hero.photoAlt")}
      />

      {/* 2. Story & Mission — light, 2-col */}
      <Section tone="light">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
          {/* Left — story prose */}
          <div>
            <Eyebrow>{t("story.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold leading-snug text-navy sm:text-3xl">
              {t("story.title")}
            </h2>
            <div className="mt-6 space-y-4 text-slate leading-relaxed">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p>{t("story.p3")}</p>
            </div>
          </div>

          {/* Right — mission card */}
          <Card variant="care-blue" className="border-care-blue/20">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-deep">
              {t("story.missionLabel")}
            </p>
            <blockquote className="mt-4 font-display text-xl leading-snug text-navy sm:text-2xl font-semibold">
              &ldquo;{t("story.mission")}&rdquo;
            </blockquote>
          </Card>
        </div>
      </Section>

      {/* 3. Editorial Band */}
      <Band eyebrow={t("band.eyebrow")} headline={t("band.headline")} />

      {/* 4. Values / Commitments — dark, 4 cards */}
      <Section tone="dark">
        <Eyebrow className="!text-sky-soft">{t("values.eyebrow")}</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-white">{t("values.title")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white" className="text-navy">
              <p className="font-semibold">{t(titleKey)}</p>
              <p className="mt-2 text-slate text-sm leading-relaxed">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. Credentials — light */}
      <Section tone="light">
        <Eyebrow>{t("credentials.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("credentials.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-slate">{t("credentials.intro")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {credentialCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white">
              <p className="font-semibold text-navy">{t(titleKey)}</p>
              <p className="mt-2 text-slate text-sm leading-relaxed">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 6. CtaBand */}
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
