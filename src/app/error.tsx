"use client";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <PageShell>
      <EmptyState title="Something went wrong">
        We couldn’t load this page.{" "}
        <Button size="sm" onClick={reset}>
          Try again
        </Button>
      </EmptyState>
    </PageShell>
  );
}
