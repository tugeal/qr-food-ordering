export const MAX_QUANTITY = 20;

/** Item id to quantity. */
export type CartState = Readonly<Record<string, number>>;

export type CartAction =
  | { type: "add"; itemId: string }
  | { type: "decrement"; itemId: string }
  | { type: "remove"; itemId: string }
  | { type: "clear" };

function without(state: CartState, itemId: string): CartState {
  const next = { ...state };
  delete next[itemId];
  return next;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const quantity = Math.min((state[action.itemId] ?? 0) + 1, MAX_QUANTITY);
      return { ...state, [action.itemId]: quantity };
    }
    case "decrement": {
      const quantity = (state[action.itemId] ?? 0) - 1;
      return quantity > 0 ? { ...state, [action.itemId]: quantity } : without(state, action.itemId);
    }
    case "remove":
      return without(state, action.itemId);
    case "clear":
      return {};
  }
}
