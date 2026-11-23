import { describe, expect, it } from "vitest";
import { toAdminMenu, type AdminItemRow } from "./mappers";

const item = (id: string, category_id: string, sort_order: number, is_available = true): AdminItemRow => ({
  id,
  category_id,
  name: `Item ${id}`,
  description: "",
  price: 10,
  emoji: "🍽️",
  image_url: null,
  is_available,
  sort_order,
});

describe("toAdminMenu", () => {
  const categories = [
    { id: "drinks", name: "Drinks", sort_order: 2 },
    { id: "meals", name: "Meals", sort_order: 1 },
    { id: "empty", name: "Empty", sort_order: 3 },
  ];
  const items = [item("tea", "drinks", 1), item("b", "meals", 2), item("a", "meals", 1, false)];

  it("keeps empty categories and counts items", () => {
    const menu = toAdminMenu(categories, items);
    expect(menu.categories.map((category) => [category.id, category.itemCount])).toEqual([
      ["meals", 2],
      ["drinks", 1],
      ["empty", 0],
    ]);
  });

  it("orders items by category, then by position, and keeps sold-out items", () => {
    const menu = toAdminMenu(categories, items);
    expect(menu.items.map((menuItem) => menuItem.id)).toEqual(["a", "b", "tea"]);
    expect(menu.items[0]?.isAvailable).toBe(false);
  });
});
