"use client";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { MAX_QUANTITY } from "../cart.reducer";
import { useCart } from "../cart-provider";

type Props = { itemId: string; itemName: string };

/** The Add button on a menu card, which becomes a quantity stepper once the item is in the cart. */
export function AddToCart({ itemId, itemName }: Props) {
  const { quantityOf, add, decrement } = useCart();
  const quantity = quantityOf(itemId);

  if (quantity === 0) {
    return (
      <Button size="sm" onClick={() => add(itemId)} aria-label={`Add ${itemName} to cart`}>
        Add
      </Button>
    );
  }

  return (
    <Stepper
      value={quantity}
      max={MAX_QUANTITY}
      label={itemName}
      onIncrement={() => add(itemId)}
      onDecrement={() => decrement(itemId)}
    />
  );
}
