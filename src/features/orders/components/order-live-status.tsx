"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePolling } from "@/hooks/use-polling";
import { isFinalStatus, isOrderStatus, STATUS_LABEL, type OrderStatus } from "../status";
import styles from "./order-live-status.module.css";
import { OrderStatusTracker } from "./order-status-tracker";

const POLL_INTERVAL_MS = 10_000;

type Props = { publicId: string; initialStatus: OrderStatus };

/** The order's status badge and progress bar, refreshed every few seconds until the order is final. */
export function OrderLiveStatus({ publicId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);

  usePolling(
    async () => {
      try {
        const response = await fetch(`/api/orders/${publicId}`, { cache: "no-store" });
        if (!response.ok) return;

        const data: unknown = await response.json();
        const next = typeof data === "object" && data !== null && "status" in data ? data.status : null;
        if (isOrderStatus(next)) setStatus(next);
      } catch {
        // A network hiccup: the next poll catches up.
      }
    },
    POLL_INTERVAL_MS,
    !isFinalStatus(status),
  );

  return (
    <div className={styles.live} aria-live="polite">
      <div>
        <StatusBadge tone={status}>{STATUS_LABEL[status]}</StatusBadge>
      </div>
      {status !== "cancelled" && <OrderStatusTracker status={status} />}
    </div>
  );
}
