import { Card } from "@/components/ui/card";
import { formatOrderTime } from "@/lib/format/datetime";
import { describePlace } from "../format";
import type { Order } from "../types";
import { OrderLiveStatus } from "./order-live-status";
import styles from "./order-overview.module.css";

/** The top card of the order page: number, live status, and where and when it was placed. */
export function OrderOverview({ order }: { order: Order }) {
  return (
    <Card className={styles.overview}>
      <div className={styles.label}>Order number</div>
      <div className={styles.number}>#{order.number}</div>
      <OrderLiveStatus
        publicId={order.id}
        initial={{ status: order.status, paymentStatus: order.paymentStatus }}
      />
      <div className={styles.label}>
        {describePlace(order)} · {formatOrderTime(order.createdAt)}
      </div>
    </Card>
  );
}
