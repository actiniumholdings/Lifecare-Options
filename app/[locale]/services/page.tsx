import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { ServicesContent } from "./ServicesContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/services",
    locale,
  });
}

export default function ServicesPage() {
  return <ServicesContent />;
}
