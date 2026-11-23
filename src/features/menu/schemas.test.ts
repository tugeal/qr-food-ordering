import { describe, expect, it } from "vitest";
import { saveCategorySchema, saveMenuItemSchema } from "./schemas";

const category = "c0000000-0000-4000-8000-000000000001";

const valid = {
  categoryId: category,
  name: " Chicken Adobo Rice ",
  description: "",
  price: 149.999,
  emoji: "🍛",
  imageUrl: "",
  isAvailable: true,
};

describe("saveMenuItemSchema", () => {
  it("accepts an item, trims the name and rounds the price to centavos", () => {
    const result = saveMenuItemSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Chicken Adobo Rice");
      expect(result.data.price).toBe(150);
    }
  });

  it("needs a category, a name and a sensible price", () => {
    expect(saveMenuItemSchema.safeParse({ ...valid, categoryId: "" }).success).toBe(false);
    expect(saveMenuItemSchema.safeParse({ ...valid, name: "   " }).success).toBe(false);
    expect(saveMenuItemSchema.safeParse({ ...valid, price: undefined }).success).toBe(false);
    expect(saveMenuItemSchema.safeParse({ ...valid, price: -1 }).success).toBe(false);
    expect(saveMenuItemSchema.safeParse({ ...valid, price: 100000 }).success).toBe(false);
  });
});

describe("saveCategorySchema", () => {
  it("accepts a new or existing category and rejects an empty name", () => {
    expect(saveCategorySchema.safeParse({ name: "Desserts" }).success).toBe(true);
    expect(saveCategorySchema.safeParse({ id: category, name: "Desserts" }).success).toBe(true);
    expect(saveCategorySchema.safeParse({ name: "  " }).success).toBe(false);
  });
});
