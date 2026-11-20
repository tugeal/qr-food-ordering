import styles from "./site-header.module.css";

type Props = { title: string; subtitle?: string };

export function SiteHeader({ title, subtitle }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
