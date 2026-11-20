import type { ReactNode } from "react";
import styles from "./page-shell.module.css";

/** The page container: max width, responsive gutters and room for the floating cart bar. */
export function PageShell({ children }: { children: ReactNode }) {
  return <main className={styles.shell}>{children}</main>;
}
