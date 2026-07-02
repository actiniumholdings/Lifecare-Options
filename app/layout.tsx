import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mylifecareoptions.com"),
  title: "Lifecare Options: Home Health in Katy, TX",
  description:
    "Medicare-certified home health in Katy, Fort Bend, and Harris counties. Skilled nursing, therapy, and personal care delivered at home since 2012.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
