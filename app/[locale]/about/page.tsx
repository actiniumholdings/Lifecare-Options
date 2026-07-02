import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { AboutContent } from "./AboutContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/about",
    locale,
  });
}

export default function AboutPage() {
  return <AboutContent />;
}
