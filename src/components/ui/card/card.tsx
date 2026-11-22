import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./card.module.css";

type Props = { as?: ElementType; className?: string; children: ReactNode };

export function Card({ as: Tag = "div", className, children }: Props) {
  return <Tag className={cn(styles.card, className)}>{children}</Tag>;
}
