import type { Database } from "@/types/database";
import type { MenuCategory } from "./types";

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
