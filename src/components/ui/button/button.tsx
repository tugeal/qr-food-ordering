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

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClass({ variant, size }, className)} {...props} />;
}
