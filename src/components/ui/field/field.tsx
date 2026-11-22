import type { ReactNode } from "react";
import styles from "./field.module.css";

type Props = { label: string; htmlFor?: string; error?: string; children: ReactNode };

/** A label, a control and an error message. Without `htmlFor` the label is plain text (groups). */
export function Field({ label, htmlFor, error, children }: Props) {
  return (
    <div>
      {htmlFor ? (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className={styles.label}>{label}</span>
      )}
      {children}
      {error && (
        <p className={styles.error} id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </p>
      )}
    </div>
  );
}
