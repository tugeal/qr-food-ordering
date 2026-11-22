import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { formatPeso } from "@/lib/format/currency";
import { MAX_QUANTITY } from "../cart.reducer";
import type { CartLine as Line } from "../types";
import styles from "./cart-line.module.css";

type Props = { line: Line; onAdd: () => void; onDecrement: () => void; onRemove: () => void };

export function CartLine({ line, onAdd, onDecrement, onRemove }: Props) {
  const { item, quantity } = line;

  return (
    <div className={styles.line}>
      <div>
        <b>{item.name}</b>
        <div className={styles.meta}>
          {formatPeso(item.price)} each{!item.isAvailable && " · sold out"}
        </div>
      </div>
      <div className={styles.controls}>
        <Stepper
          value={quantity}
          max={MAX_QUANTITY}
          label={item.name}
          onIncrement={onAdd}
          onDecrement={onDecrement}
        />
        <Button variant="secondary" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
}
