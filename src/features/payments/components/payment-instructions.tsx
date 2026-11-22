import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { formatPeso } from "@/lib/format/currency";
import type { PaymentMethod } from "../types";
import styles from "./payment-instructions.module.css";

type DetailProps = { label: string; value: string; large?: boolean };

function Detail({ label, value, large = false }: DetailProps) {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <b className={large ? styles.number : undefined}>{value}</b>
    </div>
  );
}

type Props = {
  method: PaymentMethod;
  amount: number;
  /** Extra content inside the card, such as the reference-number form supplied by the page. */
  children?: ReactNode;
};

export function PaymentInstructions({ method, amount, children }: Props) {
  const numberLabel = method.code === "bank_transfer" ? "Account number" : "Mobile number";

  return (
    <>
      <h2>Pay with {method.name}</h2>
      <Card className={styles.card}>
        <div>
          Send exactly <b className={styles.amount}>{formatPeso(amount)}</b> to:
        </div>
        {method.accountName && <Detail label="Account name" value={method.accountName} />}
        {method.bankName && <Detail label="Bank" value={method.bankName} />}
        {method.accountNumber ? (
          <Detail label={numberLabel} value={method.accountNumber} large />
        ) : (
          <p className={styles.muted}>The restaurant hasn’t added payment details yet.</p>
        )}
        {method.instructions && <div className={styles.instructions}>{method.instructions}</div>}
        {children}
      </Card>
    </>
  );
}
