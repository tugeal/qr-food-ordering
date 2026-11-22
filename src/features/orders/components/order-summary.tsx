import { Card } from "@/components/ui/card";
import { formatPeso } from "@/lib/format/currency";
import type { Order } from "../types";
import styles from "./order-summary.module.css";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <Card className={styles.summary}>
      {order.items.map((item, index) => (
        <div key={`${item.name}-${index}`} className={styles.row}>
          <span>
            {item.quantity} × {item.name}
          </span>
          <span className={styles.amount}>{formatPeso(item.lineTotal)}</span>
        </div>
      ))}
      <div className={styles.row}>
        <b>Total</b>
        <b className={styles.amount}>{formatPeso(order.total)}</b>
      </div>
      {order.instructions && <div className={styles.note}>Note: {order.instructions}</div>}
    </Card>
  );
}
