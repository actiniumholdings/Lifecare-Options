"use client";

import { useTranslations } from "next-intl";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { Band } from "@/components/ui/Band";
import { CtaBand } from "@/components/ui/CtaBand";
import { ServicesList } from "@/components/ServicesList";
import { LeadForm } from "@/components/LeadForm";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";

export function HomeContent() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <>
      {/* 1. Hero — h1 rendered once inside Hero */}
      <Hero
        eyebrow={t("hero.eyebrow")}
        headline={
          <>
            {t("hero.headline1")}
            <br />
            {t("hero.headline2")}
          </>
        }
        intro={t("hero.intro")}
        primaryCta={{ label: t("hero.ctaRequest"), href: "#contact" }}
        secondaryCta={{
          label: t("hero.ctaCall", { phone: siteConfig.phone }),
          href: siteConfig.phoneHref,
        }}
      />

      {/* 2. Trust stats strip */}
      <Section tone="light" id="trust" className="!py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat
            value={String(siteConfig.foundedYear)}
            label={t("trust.since")}
          />
          <Stat
            value={t("trust.medicareValue")}
            label={t("trust.medicareLabel")}
          />
          <Stat
            value={t("trust.chapValue")}
            label={t("trust.chapLabel")}
          />
          <Stat
            value={t("trust.oncallValue")}
            label={t("trust.oncallLabel")}
          />
        </div>
      </Section>

      {/* 3. Services */}
      <Section tone="light" id="services">
        <ServicesList />
      </Section>

      {/* 4. How It Works */}
      <Section tone="light" id="how-it-works">
        <Eyebrow>{t("how.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl">{t("how.title")}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {(
            [
              { n: 1, titleKey: "how.step1Title", bodyKey: "how.step1Body" },
              { n: 2, titleKey: "how.step2Title", bodyKey: "how.step2Body" },
              { n: 3, titleKey: "how.step3Title", bodyKey: "how.step3Body" },
            ] as const
          ).map(({ n, titleKey, bodyKey }) => (
            <li key={n} className="flex gap-4">
              <div
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-care-blue text-sm font-semibold text-white"
              >
                {n}
              </div>
              <div>
                <p className="font-semibold text-navy">{t(titleKey)}</p>
                <p className="mt-1 text-slate">{t(bodyKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5. Why Lifecare — dark */}
      <Section tone="dark" id="why-lifecare">
        <Eyebrow>{t("why.eyebrow")}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-mist">{t("why.title")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(
            [
              { titleKey: "why.card1Title", bodyKey: "why.card1Body" },
              { titleKey: "why.card2Title", bodyKey: "why.card2Body" },
              { titleKey: "why.card3Title", bodyKey: "why.card3Body" },
              { titleKey: "why.card4Title", bodyKey: "why.card4Body" },
            ] as const
          ).map(({ titleKey, bodyKey }) => (
            <Card key={titleKey} variant="white" className="text-navy">
              <p className="font-semibold">{t(titleKey)}</p>
              <p className="mt-2 text-slate">{t(bodyKey)}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 6. Editorial Band */}
      <Band eyebrow={t("band.eyebrow")} headline={t("band.headline")} />

      {/* 7. Service-Area teaser — light */}
      <Section tone="light" id="service-area">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow>{t("area.eyebrow")}</Eyebrow>
            <h2 className="mt-3">{t("area.title")}</h2>
            <p className="mt-4 text-slate">{t("area.body")}</p>
            <Button
              href="/service-area"
              variant="tertiary"
              className="mt-5 !px-0"
            >
              {t("area.cta")} &rarr;
            </Button>
          </div>
          <ul
            aria-label="Cities served"
            className="flex flex-wrap gap-2"
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
        </div>
      </Section>

      {/* 8. Testimonials — light; honest empty state */}
      <Section tone="light" id="testimonials">
        <Eyebrow>{t("testimonials.eyebrow")}</Eyebrow>
        <h2 className="mt-3">{t("testimonials.title")}</h2>
        {siteConfig.testimonials.length === 0 ? (
          <Card variant="mist" className="mt-8 max-w-md">
            <p className="text-slate">{t("testimonials.empty")}</p>
          </Card>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {siteConfig.testimonials.map((item, i) => (
              <Card key={i} variant="white">
                <blockquote>
                  <p className="text-navy">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm text-slate">
                    {item.attribution}
                  </footer>
                </blockquote>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* 9. Careers teaser — light */}
      <Section tone="light" id="careers-teaser">
        <Eyebrow>{t("careers.eyebrow")}</Eyebrow>
        <h2 className="mt-3">{t("careers.title")}</h2>
        <Card
          variant="white"
          className="mt-8 max-w-xl border-care-blue/50 text-navy"
        >
          <p className="text-slate">{t("careers.body")}</p>
          <Button href="/careers" className="mt-5">
            {t("careers.cta")}
          </Button>
        </Card>
      </Section>

      {/* 10. Lead capture form */}
      <Section tone="light" id="contact">
        <LeadForm />
      </Section>

      {/* 11. Final CTA band */}
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
