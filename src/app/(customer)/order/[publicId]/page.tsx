import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { OrderOverview } from "@/features/orders/components/order-overview";
import { OrderSummary } from "@/features/orders/components/order-summary";
import { getOrderByPublicId } from "@/features/orders/queries";
import { CustomerShell } from "../../_components/customer-shell";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const order = await getOrderByPublicId(publicId);
  if (!order) notFound();

  return (
    <CustomerShell size="narrow">
      <OrderOverview order={order} />
      <h2>Order summary</h2>
      <OrderSummary order={order} />
      <p className={styles.more}>
        <ButtonLink href="/" variant="secondary">
          Order more
        </ButtonLink>
      </p>
    </CustomerShell>
  );
}
