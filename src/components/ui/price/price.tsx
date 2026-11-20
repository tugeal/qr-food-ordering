import { formatPeso } from "@/lib/format/currency";
import styles from "./price.module.css";

export function Price({ value }: { value: number }) {
  return <span className={styles.price}>{formatPeso(value)}</span>;
}
