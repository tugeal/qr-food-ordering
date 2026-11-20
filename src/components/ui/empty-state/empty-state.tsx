import type { ReactNode } from "react";
import styles from "./empty-state.module.css";

type Props = { title?: string; children?: ReactNode };

export function EmptyState({ title, children }: Props) {
  return (
    <div className={styles.card} role="status">
      {title && <h3>{title}</h3>}
      {children && <p className={styles.text}>{children}</p>}
    </div>
  );
}
