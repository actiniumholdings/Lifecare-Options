import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { youngSerif, nunitoSans } from "@/lib/fonts";
import {
  SITE_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
  DEFAULT_DESCRIPTION,
} from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/a11y/SkipLink";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { medicalBusinessJsonLd } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${youngSerif.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={medicalBusinessJsonLd()} />
      </head>
      <body className="text-navy min-h-full flex flex-col">
        {/* <!--
        THESIS: Lifecare shares Central's layout skeleton but refuses its skin —
        family-warm where Central is institutional-editorial. Same bones, different soul.
        OWN-WORLD: warm cream canvas (#FBF5EE), peach (#F2C39B) strokes/fills and
        peach-on-warm-indigo dark bands, Lifecare blue CTAs, Young Serif (single-
        weight, size-led) + Nunito Sans, 16px radii, pill buttons, soft warm shadows.
        STORY: a family in a discharge crisis feels warmth and competence, and calls.
        FIRST VIEWPORT: eyebrow w/ peach stroke, Young Serif headline, lead, pill
        CTAs (call primary), badge pills, rounded photo right with peach corner block.
        FORM: pinned direction (Clint, 2026-08-05 brainstorm + approved live comp);
        no concept roll — user-pinned world beats the roll per new-work.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the
        finish review, the verdict, and DESIGN.md.
        --> */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipLink />
          <AnnouncementBar />
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
