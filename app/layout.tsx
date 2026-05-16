import type { Metadata } from "next";
import { albert, spectral } from "@/lib/fonts";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lifecare Options: Home Health in Katy, TX",
  description:
    "Medicare-certified home health in Katy, Fort Bend, and Harris counties. Skilled nursing, therapy, and personal care delivered at home since 2008.",
  metadataBase: new URL("https://www.mylifecareoptions.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${albert.variable} ${spectral.variable}`}>
      <body className="text-navy flex min-h-screen flex-col bg-white">
        <AnnouncementBar />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
