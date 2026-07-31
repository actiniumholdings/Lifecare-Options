import { Playfair_Display, Inter } from "next/font/google";

// Pairing is set by the Lifecare design system (SKILL.md): Playfair Display for
// display copy and the italic pull-quote, Inter for body and UI.
export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
