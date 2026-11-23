import type { Database } from "@/types/database";
import type { AdminCategory, AdminMenuItem, MenuCategory } from "./types";

type Tables = Database["public"]["Tables"];

type ItemRow = Pick<
  Tables["menu_items"]["Row"],
  "id" | "name" | "description" | "price" | "emoji" | "image_url" | "is_available" | "sort_order"
>;

export type CategoryRow = Pick<Tables["categories"]["Row"], "id" | "name" | "sort_order"> & {
  menu_items: ItemRow[];
};

/** Database rows to domain types: sorted, camelCased, and without empty categories. */
export function toMenuCategories(rows: CategoryRow[]): MenuCategory[] {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      id: category.id,
      name: category.name,
      items: [...category.menu_items]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          emoji: item.emoji,
          imageUrl: item.image_url,
          isAvailable: item.is_available,
        })),
    }))
    .filter((category) => category.items.length > 0);
}

export type AdminCategoryRow = Pick<Tables["categories"]["Row"], "id" | "name" | "sort_order">;
export type AdminItemRow = ItemRow & Pick<Tables["menu_items"]["Row"], "category_id">;

/** Everything the dashboard lists: all categories (even empty ones) and all items (even sold out). */
export function toAdminMenu(
  categoryRows: AdminCategoryRow[],
  itemRows: AdminItemRow[],
): { categories: AdminCategory[]; items: AdminMenuItem[] } {
  const orderedCategories = [...categoryRows].sort((a, b) => a.sort_order - b.sort_order);
  const position = new Map(orderedCategories.map((category, index) => [category.id, index]));

  const categories = orderedCategories.map((category) => ({
    id: category.id,
    name: category.name,
    itemCount: itemRows.filter((item) => item.category_id === category.id).length,
  }));

  // Items follow their category's order, then their own.
  const items = [...itemRows]
    .sort(
      (a, b) =>
        (position.get(a.category_id) ?? 0) - (position.get(b.category_id) ?? 0) ||
        a.sort_order - b.sort_order,
    )
    .map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      emoji: item.emoji,
      imageUrl: item.image_url,
      isAvailable: item.is_available,
    }));

  return { categories, items };
}
