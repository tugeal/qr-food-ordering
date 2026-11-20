import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { getRestaurantName } from "@/features/settings/queries";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const name = await getRestaurantName();

  return (
    <PageShell>
      <SiteHeader title={name} subtitle={siteConfig.tagline} />
      {children}
    </PageShell>
  );
}
