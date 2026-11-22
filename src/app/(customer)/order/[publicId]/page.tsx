import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { OrderOverview } from "@/features/orders/components/order-overview";
import { OrderSummary } from "@/features/orders/components/order-summary";
import { ReferenceForm } from "@/features/orders/components/reference-form";
import { getOrderByPublicId } from "@/features/orders/queries";
import { PaymentInstructions } from "@/features/payments/components/payment-instructions";
import { getPaymentMethod } from "@/features/payments/queries";
import { CustomerShell } from "../../_components/customer-shell";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const order = await getOrderByPublicId(publicId);
  if (!order) notFound();

  // Account details are looked up only for a real order that is still waiting for payment.
  const paymentMethod =
    order.paymentMethod && order.status !== "cancelled" && order.paymentStatus === "unpaid"
      ? await getPaymentMethod(order.paymentMethod)
      : null;

  return (
    <CustomerShell size="narrow">
      <OrderOverview order={order} />
      <h2>Order summary</h2>
      <OrderSummary order={order} />

      {paymentMethod && (
        <PaymentInstructions method={paymentMethod} amount={order.total}>
          <ReferenceForm orderId={order.id} initialReference={order.paymentReference} />
        </PaymentInstructions>
      )}

      <p className={styles.more}>
        <ButtonLink href="/" variant="secondary">
          Order more
        </ButtonLink>
      </p>
    </CustomerShell>
  );
}
