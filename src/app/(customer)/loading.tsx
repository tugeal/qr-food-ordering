import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function Loading() {
  return (
    <PageShell>
      <EmptyState>Loading…</EmptyState>
    </PageShell>
  );
}
