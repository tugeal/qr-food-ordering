"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { PaymentMethodCode } from "@/config/payment-methods";
import { useCart } from "@/features/cart/cart-provider";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { useHydrated } from "@/hooks/use-hydrated";
import { rememberLastOrder } from "@/lib/storage/last-order";
import styles from "./checkout-screen.module.css";

type Props = { paymentOptions: { code: PaymentMethodCode; name: string }[] };

/** Joins the cart and the checkout form. It lives here because features may not import each other. */
export function CheckoutScreen({ paymentOptions }: Props) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { lines, count, subtotal, hasUnavailable, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  // Re-fetch the menu and payment options so everything is current when the customer pays.
  useEffect(() => {
    router.refresh();
  }, [router]);

  if (placed) {
    return <EmptyState title="Order placed">Taking you to your order…</EmptyState>;
  }

  if (!hydrated) return <h2>Checkout</h2>;

  if (lines.length === 0) {
    return (
      <>
        <h2>Checkout</h2>
        <EmptyState>Your cart is empty.</EmptyState>
        <p className={styles.after}>
          <ButtonLink href="/">Browse the menu</ButtonLink>
        </p>
      </>
    );
  }

  let blocked: string | null = null;
  if (hasUnavailable) blocked = "Remove sold-out items from your cart to continue.";
  else if (paymentOptions.length === 0) blocked = "Payment isn’t set up yet. Please ask the restaurant.";

  return (
    <CheckoutForm
      items={lines.map((line) => ({ itemId: line.item.id, quantity: line.quantity }))}
      paymentOptions={paymentOptions}
      count={count}
      subtotal={subtotal}
      blocked={blocked}
      onPlaced={(orderId) => {
        setPlaced(true);
        rememberLastOrder(orderId);
        clear();
        router.push(`/order/${orderId}`);
      }}
    />
  );
}
