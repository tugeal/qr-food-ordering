import styles from "./stepper.module.css";

type Props = {
  value: number;
  label: string;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function Stepper({ value, label, max = 20, onIncrement, onDecrement }: Props) {
  return (
    <div className={styles.stepper} role="group" aria-label={`Quantity of ${label}`}>
      <button
        type="button"
        className={styles.button}
        onClick={onDecrement}
        aria-label={`Remove one ${label}`}
      >
        −
      </button>
      <b className={styles.value} aria-live="polite">
        {value}
      </b>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        disabled={value >= max}
        aria-label={`Add one ${label}`}
      >
        +
      </button>
    </div>
  );
}
