import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import type { PaymentMethodCode } from "@/config/payment-methods";
import styles from "./payment-method-picker.module.css";

type Option = { code: PaymentMethodCode; name: string };

type Props = {
  options: Option[];
  value: PaymentMethodCode | "";
  onChange: (code: PaymentMethodCode) => void;
  error?: string;
};

export function PaymentMethodPicker({ options, value, onChange, error }: Props) {
  return (
    <Field label="Payment method" error={error}>
      {options.length === 0 ? (
        <p className={styles.empty}>No payment method is set up yet. Please ask the restaurant.</p>
      ) : (
        <div className={styles.list} role="group" aria-label="Payment method">
          {options.map((option) => (
            <Chip
              key={option.code}
              className={styles.option}
              selected={value === option.code}
              onClick={() => onChange(option.code)}
            >
              {option.name}
            </Chip>
          ))}
        </div>
      )}
    </Field>
  );
}
