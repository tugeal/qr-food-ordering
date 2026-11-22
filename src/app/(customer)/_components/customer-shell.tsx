import type { ComponentProps, ReactNode } from "react";
import { MyOrderLink } from "@/components/layout/my-order-link";
import { PageShell } from "@/components/layout/page-shell";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { getRestaurantName } from "@/features/settings/queries";

type Props = { size?: ComponentProps<typeof PageShell>["size"]; children: ReactNode };

/** The page frame for every customer page: container, restaurant header and "My order" link. */
export async function CustomerShell({ size, children }: Props) {
  const name = await getRestaurantName();

  return (
    <PageShell size={size}>
      <SiteHeader title={name} subtitle={siteConfig.tagline} actions={<MyOrderLink />} />
      {children}
    </PageShell>
  );
}
