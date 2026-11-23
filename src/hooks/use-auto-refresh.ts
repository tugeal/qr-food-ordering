import { useRouter } from "next/navigation";
import { usePolling } from "./use-polling";

/** Re-fetches the current page's server data every few seconds. Client state, like open panels, is kept. */
export function useAutoRefresh(intervalMs = 10_000) {
  const router = useRouter();
  usePolling(() => router.refresh(), intervalMs);
}
