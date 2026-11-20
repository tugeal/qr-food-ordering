import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./chip.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export function Chip({ selected = false, className, ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(styles.chip, selected && styles.selected, className)}
      {...props}
    />
  );
}
