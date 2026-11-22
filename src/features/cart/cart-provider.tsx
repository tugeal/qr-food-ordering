"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cartStore } from "./cart-store";
import { anyUnavailable, countItems, subtotalOf, toLines } from "./selectors";
import type { CatalogItem } from "./types";

const CatalogContext = createContext<readonly CatalogItem[]>([]);

type Props = { catalog: readonly CatalogItem[]; children: ReactNode };

/** Gives the cart the current menu, so lines always show live names, prices and availability. */
export function CartProvider({ catalog, children }: Props) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCart() {
  const catalog = useContext(CatalogContext);
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const lines = useMemo(() => toLines(cart, catalog), [cart, catalog]);

  return {
    lines,
    count: countItems(lines),
    subtotal: subtotalOf(lines),
    hasUnavailable: anyUnavailable(lines),
    quantityOf: (itemId: string) => cart[itemId] ?? 0,
    add: (itemId: string) => cartStore.dispatch({ type: "add", itemId }),
    decrement: (itemId: string) => cartStore.dispatch({ type: "decrement", itemId }),
    remove: (itemId: string) => cartStore.dispatch({ type: "remove", itemId }),
    clear: () => cartStore.dispatch({ type: "clear" }),
  };
}
