import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/home/Hero";
import { TrustBand } from "@/components/home/TrustBand";
import { Pillars } from "@/components/home/Pillars";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyLifecare } from "@/components/home/WhyLifecare";
import { ServiceAreaTeaser } from "@/components/home/ServiceAreaTeaser";
import { CareersTeaser } from "@/components/home/CareersTeaser";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PhotoBand } from "@/components/ui/PhotoBand";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/", locale });
}

/**
 * Home page — the design-defining flagship, mirroring Central’s composition in
 * Lifecare’s identity. Sections:
 * Hero → TrustBand → Pillars → HowItWorks → WhyLifecare → PhotoBand →
 * ServiceAreaTeaser → CareersTeaser → FinalCTA. (No Testimonials — Lifecare has
 * none; we do not invent them.) Header/Footer come from the layout.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Pillars />
      <HowItWorks />
      <WhyLifecare />
      <PhotoBand
        src="/images/therapy.jpg"
        alt="A Lifecare Options therapist supporting an older client during an in-home visit"
        eyebrow="Dignity in Every Visit"
        headline="The small moments are the care. We’re there for them."
        objectPosition="50% 18%"
        align="center"
      />
      <ServiceAreaTeaser />
      <CareersTeaser />
      <FinalCTA />
    </>
  );
}
