import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AddToCart } from "@/features/cart/components/add-to-cart";
import { MenuBrowser } from "@/features/menu/components/menu-browser";
import { getMenu } from "@/features/menu/queries";
import { getRestaurantName } from "@/features/settings/queries";
import { CustomerShell } from "./_components/customer-shell";

// Prices and availability change during service, so always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getRestaurantName() };
}

export default async function MenuPage() {
  const categories = await getMenu();

  // The menu feature knows nothing about the cart: the page gives each available item its Add control.
  const itemActions: Record<string, ReactNode> = {};
  for (const category of categories) {
    for (const item of category.items) {
      if (item.isAvailable) {
        itemActions[item.id] = <AddToCart itemId={item.id} itemName={item.name} />;
      }
    }
  }

  return (
    <CustomerShell>
      <MenuBrowser categories={categories} itemActions={itemActions} />
    </CustomerShell>
  );
}
