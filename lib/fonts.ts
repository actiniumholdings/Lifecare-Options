import { Fraunces, Inter } from "next/font/google";

/** Display serif — Central's editorial typeface. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "900"],
  variable: "--font-fraunces",
});

/** Body sans. */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
