import { useSyncExternalStore } from "react";

const STORAGE_KEY = "qfo-last-order";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Remembers the latest order on this device so "My order" can link back to it. */
export function rememberLastOrder(orderId: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, orderId);
  } catch {
    // Storage unavailable (private mode): the order page URL still works.
  }
  listeners.forEach((listener) => listener());
}

export function useLastOrderId(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
