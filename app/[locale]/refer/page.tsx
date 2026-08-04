import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { ReferContent } from "./ReferContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refer" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/refer", locale });
}

export default function ReferPage() {
  return <ReferContent />;
}
