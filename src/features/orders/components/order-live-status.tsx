"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePolling } from "@/hooks/use-polling";
import { isSettled, parseLiveState, STATUS_LABEL, type LiveState } from "../status";
import styles from "./order-live-status.module.css";
import { OrderStatusTracker } from "./order-status-tracker";

const POLL_INTERVAL_MS = 10_000;

type Props = { publicId: string; initial: LiveState };

/** Status badges and the progress bar, refreshed every few seconds until nothing can change. */
export function OrderLiveStatus({ publicId, initial }: Props) {
  const router = useRouter();
  const [live, setLive] = useState(initial);

  usePolling(
    async () => {
      try {
        const response = await fetch(`/api/orders/${publicId}`, { cache: "no-store" });
        if (!response.ok) return;

        const next = parseLiveState(await response.json());
        if (!next) return;

        setLive(next);

        // The payment section is rendered on the server: refresh it once the order is paid or cancelled.
        const paidNow = next.paymentStatus !== live.paymentStatus;
        const cancelledNow = next.status === "cancelled" && live.status !== "cancelled";
        if (paidNow || cancelledNow) router.refresh();
      } catch {
        // A network hiccup: the next poll catches up.
      }
    },
    POLL_INTERVAL_MS,
    !isSettled(live.status, live.paymentStatus),
  );

  return (
    <div className={styles.live} aria-live="polite">
      <div className={styles.badges}>
        <StatusBadge tone={live.status}>{STATUS_LABEL[live.status]}</StatusBadge>
        <Badge>{live.paymentStatus === "paid" ? "Paid" : "Unpaid"}</Badge>
      </div>
      {live.status !== "cancelled" && <OrderStatusTracker status={live.status} />}
    </div>
  );
}
