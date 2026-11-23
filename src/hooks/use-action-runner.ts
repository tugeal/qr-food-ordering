import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Result } from "@/lib/actions/result";

/** Runs a Server Action, keeps its error message, and refreshes the page's data afterwards. */
export function useActionRunner() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(task: () => Promise<Result<unknown>>, onSuccess?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await task();
      if (result.ok) onSuccess?.();
      else setError(result.error);
      router.refresh();
    });
  }

  return { run, error, pending };
}
