import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { QrPanel } from "@/features/settings/components/qr-panel";
import { getMenuUrl, getRestaurantName } from "@/features/settings/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "QR code", robots: { index: false, follow: false } };

// TODO(phase 4): protect with requireAdmin() in src/app/(admin)/admin/layout.tsx.
export default async function QrPage() {
  const [name, menuUrl] = await Promise.all([getRestaurantName(), getMenuUrl()]);

  return (
    <PageShell>
      <SiteHeader title={name} subtitle="Admin dashboard" />
      <QrPanel menuUrl={menuUrl} />
    </PageShell>
  );
}
