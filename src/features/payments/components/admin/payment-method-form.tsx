"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Checkbox, Input, Textarea } from "@/components/ui/input";
import { savePaymentMethod } from "../../actions";
import type { AdminPaymentMethod } from "../../types";
import styles from "./payment-method-form.module.css";

/** One payment method: switch it on, and set the account customers send money to. */
export function PaymentMethodForm({ method }: { method: AdminPaymentMethod }) {
  const router = useRouter();
  const [values, setValues] = useState({
    displayName: method.name,
    accountName: method.accountName,
    accountNumber: method.accountNumber,
    bankName: method.bankName,
    instructions: method.instructions,
    isActive: method.isActive,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ kind: "saved" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const isBank = method.code === "bank_transfer";
  const id = (field: string) => `${method.code}-${field}`;
  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setMessage(null);
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);

    startTransition(async () => {
      const result = await savePaymentMethod({ code: method.code, ...values });
      if (result.ok) {
        setMessage({ kind: "saved", text: "Saved" });
        router.refresh();
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setMessage({ kind: "error", text: result.error });
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Card>
        <div className={styles.header}>
          <h3>{method.name}</h3>
          <Checkbox
            checked={values.isActive}
            onChange={(event) => set("isActive", event.target.checked)}
          >
            Enabled
          </Checkbox>
        </div>

        <Field label="Name customers see" htmlFor={id("displayName")} error={errors.displayName?.[0]}>
          <Input
            id={id("displayName")}
            value={values.displayName}
            onChange={(event) => set("displayName", event.target.value)}
            maxLength={40}
          />
        </Field>

        <Field label="Account name" htmlFor={id("accountName")} error={errors.accountName?.[0]}>
          <Input
            id={id("accountName")}
            value={values.accountName}
            onChange={(event) => set("accountName", event.target.value)}
            maxLength={60}
          />
        </Field>

        {isBank && (
          <Field label="Bank name" htmlFor={id("bankName")} error={errors.bankName?.[0]}>
            <Input
              id={id("bankName")}
              value={values.bankName}
              onChange={(event) => set("bankName", event.target.value)}
              maxLength={40}
            />
          </Field>
        )}

        <Field
          label={isBank ? "Account number" : "Mobile number"}
          htmlFor={id("accountNumber")}
          error={errors.accountNumber?.[0]}
        >
          <Input
            id={id("accountNumber")}
            value={values.accountNumber}
            onChange={(event) => set("accountNumber", event.target.value)}
            maxLength={30}
          />
        </Field>

        <Field
          label="Instructions for customers"
          htmlFor={id("instructions")}
          error={errors.instructions?.[0]}
        >
          <Textarea
            id={id("instructions")}
            value={values.instructions}
            onChange={(event) => set("instructions", event.target.value)}
            maxLength={300}
          />
        </Field>

        <div className={styles.actions}>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : `Save ${method.name}`}
          </Button>
          {message && (
            <span
              className={message.kind === "error" ? styles.error : styles.saved}
              role={message.kind === "error" ? "alert" : "status"}
            >
              {message.text}
            </span>
          )}
        </div>
      </Card>
    </form>
  );
}
