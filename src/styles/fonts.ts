import { Instrument_Serif, Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
