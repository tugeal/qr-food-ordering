import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./button.module.css";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";
type StyleProps = { variant?: Variant; size?: Size };

function buttonClass({ variant = "primary", size = "md" }: StyleProps, className?: string) {
  return cn(styles.button, styles[variant], size === "sm" && styles.sm, className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass({ variant, size }, className)} {...props} />;
}

type ButtonLinkProps = StyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function ButtonLink({ variant, size, className, href, ...props }: ButtonLinkProps) {
  const classes = buttonClass({ variant, size }, className);

  // Pages navigate client-side; API routes and downloads need a plain anchor.
  const isPage = href.startsWith("/") && !href.startsWith("/api/");
  return isPage ? (
    <Link href={href} className={classes} {...props} />
  ) : (
    <a href={href} className={classes} {...props} />
  );
}
