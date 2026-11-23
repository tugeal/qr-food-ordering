import type { Metadata } from "next";
import { MenuManager } from "@/features/menu/components/admin/menu-manager";
import { getAdminMenu } from "@/features/menu/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Menu" };

export default async function MenuAdminPage() {
  const { categories, items } = await getAdminMenu();
  return <MenuManager categories={categories} items={items} />;
}
