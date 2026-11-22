import type { ReactNode } from "react";
import styles from "./page-shell.module.css";

export type PageSize = "wide" | "form" | "medium" | "narrow";

/** The page container: max width, responsive gutters and room for the floating cart bar. */
export function PageShell({ size = "wide", children }: { size?: PageSize; children: ReactNode }) {
  return (
    <main className={styles.shell} data-size={size}>
      {children}
    </main>
  );
}
