import { describe, expect, it } from "vitest";
import { cartReducer, MAX_QUANTITY, type CartState } from "./cart.reducer";

describe("cartReducer", () => {
  it("adds an item and counts up", () => {
    const once = cartReducer({}, { type: "add", itemId: "a" });
    expect(once).toEqual({ a: 1 });
    expect(cartReducer(once, { type: "add", itemId: "a" })).toEqual({ a: 2 });
  });

  it("caps the quantity", () => {
    const full: CartState = { a: MAX_QUANTITY };
    expect(cartReducer(full, { type: "add", itemId: "a" })).toEqual({ a: MAX_QUANTITY });
  });

  it("drops the item when decremented to zero", () => {
    expect(cartReducer({ a: 1, b: 2 }, { type: "decrement", itemId: "a" })).toEqual({ b: 2 });
    expect(cartReducer({ a: 2 }, { type: "decrement", itemId: "a" })).toEqual({ a: 1 });
  });

  it("removes one item or clears everything", () => {
    expect(cartReducer({ a: 3, b: 1 }, { type: "remove", itemId: "a" })).toEqual({ b: 1 });
    expect(cartReducer({ a: 3, b: 1 }, { type: "clear" })).toEqual({});
  });

  it("never mutates the previous state", () => {
    const state: CartState = Object.freeze({ a: 1 });
    expect(() => cartReducer(state, { type: "add", itemId: "a" })).not.toThrow();
    expect(() => cartReducer(state, { type: "remove", itemId: "a" })).not.toThrow();
    expect(state).toEqual({ a: 1 });
  });
});
