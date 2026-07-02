import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { SkilledContent } from "./SkilledContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "skilled" });
  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/services/skilled",
    locale,
  });
}

export default function SkilledPage() {
  return <SkilledContent />;
}
