import { formatPeso } from "@/lib/format/currency";
import styles from "./cart-summary.module.css";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span className={styles.muted}>Subtotal</span>
        <b className={styles.amount}>{formatPeso(subtotal)}</b>
      </div>
      <div className={styles.row}>
        <span>Total</span>
        <b className={styles.total}>{formatPeso(subtotal)}</b>
      </div>
    </div>
  );
}
