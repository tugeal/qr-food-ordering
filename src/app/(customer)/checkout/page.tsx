import type { Metadata } from "next";
import { CustomerShell } from "../_components/customer-shell";
import { CheckoutScreen } from "./_components/checkout-screen";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <CustomerShell size="form">
      <CheckoutScreen />
    </CustomerShell>
  );
}
