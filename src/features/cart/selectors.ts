import type { CartState } from "./cart.reducer";
import type { CartLine, CatalogItem } from "./types";

/** Cart lines in menu order. Items that are no longer on the menu are dropped. */
export function toLines(cart: CartState, catalog: readonly CatalogItem[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of catalog) {
    const quantity = cart[item.id];
    if (quantity && quantity > 0) lines.push({ item, quantity });
  }
  return lines;
}

export function countItems(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Sums in whole centavos so decimals never drift. */
export function subtotalOf(lines: readonly CartLine[]): number {
  const centavos = lines.reduce(
    (sum, line) => sum + Math.round(line.item.price * 100) * line.quantity,
    0,
  );
  return centavos / 100;
}

export function anyUnavailable(lines: readonly CartLine[]): boolean {
  return lines.some((line) => !line.item.isAvailable);
}
