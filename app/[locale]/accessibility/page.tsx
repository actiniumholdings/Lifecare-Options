import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { AccessibilityContent } from "./AccessibilityContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accessibility" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/accessibility", locale });
}

export default function AccessibilityPage() {
  return <AccessibilityContent />;
}
