import { describe, expect, it } from "vitest";
import { toMenuCategories, type CategoryRow } from "./mappers";

const item = (id: string, sort_order: number, is_available = true) => ({
  id,
  name: `Item ${id}`,
  description: "",
  price: 10,
  emoji: "🍽️",
  image_url: null,
  is_available,
  sort_order,
});

const rows: CategoryRow[] = [
  { id: "drinks", name: "Drinks", sort_order: 2, menu_items: [item("tea", 1)] },
  { id: "meals", name: "Meals", sort_order: 1, menu_items: [item("b", 2), item("a", 1, false)] },
  { id: "empty", name: "Empty", sort_order: 3, menu_items: [] },
];

describe("toMenuCategories", () => {
  it("orders categories and items by sort_order", () => {
    const result = toMenuCategories(rows);
    expect(result.map((category) => category.id)).toEqual(["meals", "drinks"]);
    expect(result[0]?.items.map((menuItem) => menuItem.id)).toEqual(["a", "b"]);
  });

  it("hides categories without items", () => {
    expect(toMenuCategories(rows).some((category) => category.id === "empty")).toBe(false);
  });

  it("maps availability and image fields", () => {
    expect(toMenuCategories(rows)[0]?.items[0]).toMatchObject({ isAvailable: false, imageUrl: null });
  });
});
