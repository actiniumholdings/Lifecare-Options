"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig } from "@/lib/site-config";

export function RpmContent() {
  const t = useTranslations("rpm");
  const tCommon = useTranslations("common");

  const advantageCards = [
    { titleKey: "advantages.card1Title", bodyKey: "advantages.card1Body" },
    { titleKey: "advantages.card2Title", bodyKey: "advantages.card2Body" },
    { titleKey: "advantages.card3Title", bodyKey: "advantages.card3Body" },
    { titleKey: "advantages.card4Title", bodyKey: "advantages.card4Body" },
    { titleKey: "advantages.card5Title", bodyKey: "advantages.card5Body" },
    { titleKey: "advantages.card6Title", bodyKey: "advantages.card6Body" },
  ] as const;

  const whoCards = [
    { titleKey: "who.card1Title", bodyKey: "who.card1Body" },
    { titleKey: "who.card2Title", bodyKey: "who.card2Body" },
    { titleKey: "who.card3Title", bodyKey: "who.card3Body" },
    { titleKey: "who.card4Title", bodyKey: "who.card4Body" },
  ] as const;

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={
          <>
            {t("hero.eyebrow")}{" "}
            <span className="ml-1.5 inline-flex items-center rounded-full bg-care-blue px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
              {t("hero.badge")}
            </span>
          </>
        }
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.primary"), href: "/contact" }}
        secondaryCta={{
          label: tCommon("callUs") + " " + siteConfig.phone,
          href: siteConfig.phoneHref,
        }}
      />

      {/* 2. Advantages — light, 6 cards */}
      <Section tone="light" id="advantages">
        <Eyebrow>{t("advantages.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("advantages.title")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantageCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white" className="text-navy">
              <p className="font-semibold text-navy">{t(titleKey)}</p>
              <p className="mt-2 text-sm text-slate leading-relaxed">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. Who it helps — dark, 4 cards */}
      <Section tone="dark" id="who-it-helps">
        <Eyebrow className="!text-care-blue/80">{t("who.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-mist">{t("who.title")}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {whoCards.map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white" className="text-navy">
              <p className="font-semibold">{t(titleKey)}</p>
              <p className="mt-2 text-slate text-sm leading-relaxed">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 4. Coverage & cost — light */}
      <Section tone="light" id="coverage">
        <Eyebrow>{t("coverage.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("coverage.title")}</h2>
        <p className="mt-5 max-w-2xl text-slate leading-relaxed">{t("coverage.body")}</p>
        <p className="mt-3 max-w-2xl text-sm text-slate">{t("coverage.note")}</p>
      </Section>

      {/* 5. CtaBand */}
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
