"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCart } from "../cart-provider";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";
import styles from "./cart-view.module.css";

function EmptyCart() {
  return (
    <>
      <EmptyState>Your cart is empty.</EmptyState>
      <p className={styles.after}>
        <ButtonLink href="/">Browse the menu</ButtonLink>
      </p>
    </>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const { lines, subtotal, hasUnavailable, add, decrement, remove } = useCart();

  return (
    <>
      <h2>Your cart</h2>
      {hydrated &&
        (lines.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <Card className={styles.list}>
              {lines.map((line) => (
                <CartLine
                  key={line.item.id}
                  line={line}
                  onAdd={() => add(line.item.id)}
                  onDecrement={() => decrement(line.item.id)}
                  onRemove={() => remove(line.item.id)}
                />
              ))}
              <CartSummary subtotal={subtotal} />
            </Card>

            {hasUnavailable && (
              <p className={styles.notice} role="status">
                Remove sold-out items to continue.
              </p>
            )}

            <div className={styles.actions}>
              <ButtonLink href="/" variant="secondary">
                Add more
              </ButtonLink>
              {hasUnavailable ? (
                <Button disabled>Checkout</Button>
              ) : (
                <ButtonLink href="/checkout">Checkout</ButtonLink>
              )}
            </div>
          </>
        ))}
    </>
  );
}
