import { Card } from "@/components/ui/card";
import { formatOrderTime } from "@/lib/format/datetime";
import type { Order } from "../types";
import { OrderLiveStatus } from "./order-live-status";
import styles from "./order-overview.module.css";

function describe(order: Order): string {
  if (order.type === "takeout") return "Takeout";
  return order.table ? `Dine-in · Table ${order.table}` : "Dine-in";
}

/** The top card of the order page: number, live status, and where and when it was placed. */
export function OrderOverview({ order }: { order: Order }) {
  return (
    <Card className={styles.overview}>
      <div className={styles.label}>Order number</div>
      <div className={styles.number}>#{order.number}</div>
      <OrderLiveStatus publicId={order.id} initialStatus={order.status} />
      <div className={styles.label}>
        {describe(order)} · {formatOrderTime(order.createdAt)}
      </div>
    </Card>
  );
}
