"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { saveReference } from "../actions";
import styles from "./reference-form.module.css";

type Props = { orderId: string; initialReference: string | null };

/** Where a customer pastes the reference number from their GCash, Maya or bank receipt. */
export function ReferenceForm({ orderId, initialReference }: Props) {
  const [reference, setReference] = useState(initialReference ?? "");
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSaved(false);

    startTransition(async () => {
      const result = await saveReference({ orderId, reference });
      if (result.ok) {
        setSaved(true);
        return;
      }
      setError(result.fieldErrors?.reference?.[0] ?? result.error);
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Field label="Reference number (optional)" htmlFor="reference" error={error}>
        <div className={styles.row}>
          <Input
            id="reference"
            name="reference"
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setSaved(false);
            }}
            maxLength={40}
            autoComplete="off"
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </Field>
      {saved && (
        <p className={styles.saved} role="status">
          Saved
        </p>
      )}
    </form>
  );
}
