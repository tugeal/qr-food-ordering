import { describe, expect, it } from "vitest";
import { anyUnavailable, countItems, subtotalOf, toLines } from "./selectors";
import type { CatalogItem } from "./types";

const catalog: CatalogItem[] = [
  { id: "a", name: "Adobo", price: 149.5, isAvailable: true },
  { id: "b", name: "Turon", price: 59.1, isAvailable: false },
  { id: "c", name: "Tea", price: 49, isAvailable: true },
];

describe("cart selectors", () => {
  it("lists lines in menu order and ignores unknown items", () => {
    const lines = toLines({ c: 1, ghost: 4, a: 2 }, catalog);
    expect(lines.map((line) => line.item.id)).toEqual(["a", "c"]);
    expect(lines.map((line) => line.quantity)).toEqual([2, 1]);
  });

  it("counts items", () => {
    expect(countItems(toLines({ a: 2, c: 3 }, catalog))).toBe(5);
  });

  it("adds prices without floating-point drift", () => {
    expect(subtotalOf(toLines({ a: 2, b: 3 }, catalog))).toBe(476.3);
  });

  it("flags sold-out lines", () => {
    expect(anyUnavailable(toLines({ a: 1 }, catalog))).toBe(false);
    expect(anyUnavailable(toLines({ a: 1, b: 1 }, catalog))).toBe(true);
  });
});
