import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { instrumentSerif, inter } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Order online", template: "%s · Order online" },
  description: "Scan, browse the menu and order from your phone.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
