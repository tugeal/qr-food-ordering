import { useEffect, useRef } from "react";

/** Calls `callback` every `intervalMs` while `enabled` and the tab is visible. */
export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled = true,
) {
  const latest = useRef(callback);

  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (document.visibilityState === "visible") void latest.current();
    };

    const id = window.setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick); // catch up when the tab comes back
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [intervalMs, enabled]);
}
