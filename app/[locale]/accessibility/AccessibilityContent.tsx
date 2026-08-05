"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaBand } from "@/components/ui/CtaBand";
import { siteConfig } from "@/lib/site-config";

export function AccessibilityContent() {
  const t = useTranslations("accessibility");
  const tCommon = useTranslations("common");

  return (
    <>
      {/* 1. Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={t("hero.headline")}
        intro={t("hero.intro")}
        photoSrc="/images/coordinator.jpg"
        photoAlt="A smiling Lifecare care coordinator wearing a headset, ready to help."
      />

      {/* 2. Our commitment — light */}
      <Section tone="light">
        <Eyebrow>{t("commitment.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("commitment.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-slate">{t("commitment.body")}</p>
      </Section>

      {/* 3. What we've done — dark */}
      <Section tone="dark">
        <Eyebrow className="!text-peach-tint">{t("done.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          {t("done.title")}
        </h2>
        <ul className="mt-6 max-w-2xl space-y-3 text-white/85">
          <li>{t("done.item1")}</li>
          <li>{t("done.item2")}</li>
          <li>{t("done.item3")}</li>
          <li>{t("done.item4")}</li>
          <li>{t("done.item5")}</li>
          <li>{t("done.item6")}</li>
        </ul>
      </Section>

      {/* 4. Ongoing work — light */}
      <Section tone="light">
        <Eyebrow>{t("ongoing.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("ongoing.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-slate">{t("ongoing.body")}</p>
      </Section>

      {/* 5. Contact us about access — light */}
      <Section tone="light">
        <Eyebrow>{t("contact.eyebrow")}</Eyebrow>
        <h2 className="mt-4 text-2xl font-semibold text-navy sm:text-3xl">
          {t("contact.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-slate">{t("contact.body")}</p>
        {/* Phone only: there is no monitored public mailbox on this domain. */}
        <ul className="mt-6 space-y-2 text-navy">
          <li>
            <span className="font-semibold">{t("contact.phoneLabel")}: </span>
            <a
              href={siteConfig.phoneHref}
              className="text-blue-deep underline underline-offset-2 hover:text-navy"
            >
              {siteConfig.phone}
            </a>
          </li>
        </ul>
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
