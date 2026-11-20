import type { Metadata } from "next";
import { MenuBrowser } from "@/features/menu/components/menu-browser";
import { getMenu } from "@/features/menu/queries";
import { getRestaurantName } from "@/features/settings/queries";

// Prices and availability change during service, so always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await getRestaurantName() };
}

export default async function MenuPage() {
  const categories = await getMenu();
  return <MenuBrowser categories={categories} />;
}
