import type { AdminPaymentMethod } from "../../types";
import { PaymentMethodForm } from "./payment-method-form";
import styles from "./payment-settings.module.css";

export function PaymentSettings({ methods }: { methods: AdminPaymentMethod[] }) {
  return (
    <div className={styles.grid}>
      {methods.map((method) => (
        <PaymentMethodForm key={method.code} method={method} />
      ))}
    </div>
  );
}
