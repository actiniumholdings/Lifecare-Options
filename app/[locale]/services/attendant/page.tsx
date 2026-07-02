import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { AttendantContent } from "./AttendantContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attendant" });
  return buildMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/services/attendant",
    locale,
  });
}

export default function AttendantPage() {
  return <AttendantContent />;
}
