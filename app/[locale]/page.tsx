import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { HomeContent } from "./HomeContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/", locale });
}

export default function HomePage() {
  return <HomeContent />;
}
