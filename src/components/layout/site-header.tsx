import type { ReactNode } from "react";
import styles from "./site-header.module.css";

type Props = { title: string; subtitle?: string; actions?: ReactNode };

export function SiteHeader({ title, subtitle, actions }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
