import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { Tabs } from "@/components/ui/tabs";
import { countPendingOrders } from "@/features/orders/queries";
import { getRestaurantName } from "@/features/settings/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminHeaderActions } from "./_components/admin-header-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

// This check redirects strangers, but a layout is not re-run on every navigation. Every admin page,
// query and action checks the role again.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const [name, pending] = await Promise.all([getRestaurantName(), countPendingOrders()]);

  return (
    <PageShell>
      <SiteHeader title={name} subtitle="Admin dashboard" actions={<AdminHeaderActions />} />
      <Tabs
        label="Admin sections"
        items={[
          { href: "/admin/orders", label: "Orders", count: pending },
          { href: "/admin/menu", label: "Menu" },
          { href: "/admin/payments", label: "Payments" },
          { href: "/admin/qr", label: "QR code" },
        ]}
      />
      {children}
    </PageShell>
  );
}
