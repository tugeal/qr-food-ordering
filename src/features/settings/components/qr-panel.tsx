import { ButtonLink } from "@/components/ui/button";
import styles from "./qr-panel.module.css";

export function QrPanel({ menuUrl }: { menuUrl: string }) {
  return (
    <section className={styles.panel} aria-labelledby="qr-heading">
      <h2 id="qr-heading">Menu QR code</h2>
      <p className={styles.help}>
        Customers who scan this code open <span className={styles.url}>{menuUrl}</span>
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.code}
        src="/api/qr"
        alt={`QR code that opens ${menuUrl}`}
        width={240}
        height={240}
      />
      <div className={styles.actions}>
        <ButtonLink href="/api/qr?format=png&download=1">Download PNG</ButtonLink>
        <ButtonLink variant="secondary" href="/api/qr?download=1">
          Download SVG
        </ButtonLink>
      </div>
      <p className={styles.help}>
        Change the menu link in Restaurant details, then download a fresh code. Print only after
        your final domain is set.
      </p>
    </section>
  );
}
