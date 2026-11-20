import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <PageShell>
      <EmptyState title="Page not found">
        That page doesn’t exist. <Link href="/">Back to the menu</Link>
      </EmptyState>
    </PageShell>
  );
}
