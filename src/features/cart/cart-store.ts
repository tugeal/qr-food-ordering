import { cartReducer, MAX_QUANTITY, type CartAction, type CartState } from "./cart.reducer";

/**
 * The cart lives in localStorage so it survives refreshes, and is exposed as an external store
 * for useSyncExternalStore. Client-side only: the server always sees an empty cart.
 */
const STORAGE_KEY = "qfo-cart";
const EMPTY: CartState = {};

let snapshot: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persist(state: CartState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode): the cart keeps working in memory for this visit.
  }
}

/** Accepts only whole, positive quantities, so a hand-edited value can't poison the cart. */
function parse(raw: string | null): CartState {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null || Array.isArray(data)) return EMPTY;

    const cart: Record<string, number> = {};
    for (const [itemId, quantity] of Object.entries(data)) {
      if (typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0) {
        cart[itemId] = Math.min(quantity, MAX_QUANTITY);
      }
    }
    return cart;
  } catch {
    return EMPTY;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  snapshot = parse(readStorage());
}

function emit() {
  listeners.forEach((listener) => listener());
}

export const cartStore = {
  getSnapshot(): CartState {
    load();
    return snapshot;
  },

  getServerSnapshot(): CartState {
    return EMPTY;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    // Keep several tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      snapshot = parse(readStorage());
      listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  dispatch(action: CartAction) {
    load();
    snapshot = cartReducer(snapshot, action);
    persist(snapshot);
    emit();
  },
};
