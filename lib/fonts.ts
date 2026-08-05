import { Young_Serif, Nunito_Sans } from "next/font/google";

/** Display serif — Lifecare's warm, rounded editorial voice (spec 2026-08-05).
 *  Young Serif ships a single 400 weight: display hierarchy comes from SIZE,
 *  never from weight. Do not add font-bold to display-face headings. */
export const youngSerif = Young_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-young-serif",
});

/** Body/UI sans — gently rounded humanist. */
export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito-sans",
});
