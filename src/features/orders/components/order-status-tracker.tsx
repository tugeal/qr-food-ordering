import { cn } from "@/lib/utils";
import { PROGRESS_STEPS, progressIndex, STATUS_LABEL, type OrderStatus } from "../status";
import styles from "./order-status-tracker.module.css";

/** Four bars: pending, confirmed, preparing, completed. */
export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const current = progressIndex(status);

  return (
    <div className={styles.steps} role="img" aria-label={`Order progress: ${STATUS_LABEL[status]}`}>
      {PROGRESS_STEPS.map((step, index) => (
        <i key={step} className={cn(styles.step, index <= current && styles.done)} />
      ))}
    </div>
  );
}
