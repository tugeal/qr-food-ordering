import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/cart-view";
import { CustomerShell } from "../_components/customer-shell";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <CustomerShell size="medium">
      <CartView />
    </CustomerShell>
  );
}
