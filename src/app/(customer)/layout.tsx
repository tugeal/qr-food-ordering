import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/cart-provider";
import { CartBar } from "@/features/cart/components/cart-bar";
import { getMenu } from "@/features/menu/queries";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const categories = await getMenu();
  const catalog = categories.flatMap((category) =>
    category.items.map(({ id, name, price, isAvailable }) => ({ id, name, price, isAvailable })),
  );

  return (
    <CartProvider catalog={catalog}>
      {children}
      <CartBar />
    </CartProvider>
  );
}
