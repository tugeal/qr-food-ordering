import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./input.module.css";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(styles.control, className)} rows={2} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(styles.control, className)} {...props} />;
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { children: ReactNode };

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label className={cn(styles.check, className)}>
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}
