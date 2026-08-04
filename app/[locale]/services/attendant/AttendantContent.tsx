"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StepList } from "@/components/ui/StepList";
import { CtaBand } from "@/components/ui/CtaBand";
import { Card } from "@/components/Card";
import { siteConfig } from "@/lib/site-config";

const TASK_KEYS = [
  "bathing",
  "meals",
  "housekeeping",
  "errands",
  "companionship",
  "mobility",
] as const;

/**
 * /services/attendant — Provider Attendant Services pillar (spec §6, minus
 * payer/eligibility content per client direction 2026-07-02). Coverage is
 * addressed only by a single soft "we'll walk you through coverage" line;
 * no payer names, no two-path eligibility section, no guarantees.
 */
export function AttendantContent() {
  const t = useTranslations("attendant");
  const tCommon = useTranslations("common");

  const expectSteps = [
    { title: t("expect.step1.title"), body: t("expect.step1.body") },
    { title: t("expect.step2.title"), body: t("expect.step2.body") },
    { title: t("expect.step3.title"), body: t("expect.step3.body") },
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
        photoSrc="/images/attendant-daily.jpg"
        photoAlt="A caregiver helps an older adult with everyday tasks at home."
      />

      {/* 2. What an attendant helps with — task grid */}
      <Section tone="light" id="tasks">
        <Eyebrow>{t("tasks.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("tasks.title")}</h2>
        <p className="mt-4 max-w-2xl text-slate">{t("tasks.body")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TASK_KEYS.map((key) => (
            <Card key={key} variant="white" className="text-navy">
              <p className="font-semibold text-navy">
                {t(`tasks.${key}.title`)}
              </p>
              <p className="mt-2 text-sm text-slate">
                {t(`tasks.${key}.body`)}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 3. What to expect */}
      <Section
        tone="dark"
        eyebrow={t("expect.eyebrow")}
        title={t("expect.title")}
        intro={t("expect.intro")}
        id="what-to-expect"
      >
        <StepList steps={expectSteps} tone="dark" />
        {/* 4. Soft coverage line — no payer names, no eligibility paths */}
        <p className="mt-10 max-w-2xl text-sm text-white/75">
          {t("coverage.line")}
        </p>
      </Section>

      {/* 5. Attendant-careers cross-link */}
      <CtaBand
        headline={t("careers.headline")}
        primary={{ label: t("careers.cta"), href: "/careers" }}
      />

      {/* 6. Closing CTA */}
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
