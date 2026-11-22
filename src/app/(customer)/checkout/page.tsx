import type { Metadata } from "next";
import { getPaymentOptions } from "@/features/payments/queries";
import { CustomerShell } from "../_components/customer-shell";
import { CheckoutScreen } from "./_components/checkout-screen";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const paymentOptions = await getPaymentOptions();

  return (
    <CustomerShell size="form">
      <CheckoutScreen paymentOptions={paymentOptions} />
    </CustomerShell>
  );
}
