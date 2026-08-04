import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { RpmContent } from "./RpmContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rpm" });
  return buildMetadata({ title: t("meta.title"), description: t("meta.description"), path: "/remote-patient-monitoring", locale });
}

export default function RemotePatientMonitoringPage() {
  return <RpmContent />;
}
