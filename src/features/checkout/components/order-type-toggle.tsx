import { Chip } from "@/components/ui/chip";
import type { OrderTypeValue } from "../schemas";
import styles from "./order-type-toggle.module.css";

const OPTIONS: { value: OrderTypeValue; label: string }[] = [
  { value: "dine_in", label: "Dine-in" },
  { value: "takeout", label: "Takeout" },
];

type Props = { value: OrderTypeValue; onChange: (value: OrderTypeValue) => void };

export function OrderTypeToggle({ value, onChange }: Props) {
  return (
    <div className={styles.toggle} role="group" aria-label="Order type">
      {OPTIONS.map((option) => (
        <Chip
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
}
