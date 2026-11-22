"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import type { PaymentMethodCode } from "@/config/payment-methods";
import { formatPeso } from "@/lib/format/currency";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";
import { placeOrder } from "../actions";
import type { OrderTypeValue } from "../schemas";
import styles from "./checkout-form.module.css";
import { OrderTypeToggle } from "./order-type-toggle";
import { PaymentMethodPicker } from "./payment-method-picker";

type Props = {
  items: { itemId: string; quantity: number }[];
  paymentOptions: { code: PaymentMethodCode; name: string }[];
  count: number;
  subtotal: number;
  /** Why the order can't be placed yet, such as sold-out items in the cart. */
  blocked?: string | null;
  onPlaced: (orderId: string) => void;
};

type Values = {
  name: string;
  phone: string;
  orderType: OrderTypeValue;
  table: string;
  notes: string;
  paymentMethod: PaymentMethodCode | "";
  website: string;
};

const INITIAL: Values = {
  name: "",
  phone: "",
  orderType: "dine_in",
  table: "",
  notes: "",
  paymentMethod: "",
  website: "",
};

export function CheckoutForm({ items, paymentOptions, count, subtotal, blocked, onPlaced }: Props) {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const errorOf = (field: string) => errors[field]?.[0];
  const aria = (field: string) =>
    errorOf(field) ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blocked || pending) return;

    setErrors({});
    setFormError(null);
    startTransition(async () => {
      const result = await placeOrder({ ...values, items });
      if (result.ok) {
        onPlaced(result.data.orderId);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error);
    });
  }

  return (
    <>
      <h2>Checkout</h2>
      <form className={styles.layout} onSubmit={submit} noValidate>
        <Card>
          <Field label="Your name" htmlFor="name" error={errorOf("name")}>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              autoComplete="name"
              maxLength={60}
              {...aria("name")}
            />
          </Field>

          <Field label="Mobile number" htmlFor="phone" error={errorOf("phone")}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              autoComplete="tel"
              placeholder="09171234567"
              maxLength={16}
              {...aria("phone")}
            />
          </Field>

          <Field label="Order type">
            <OrderTypeToggle
              value={values.orderType}
              onChange={(orderType) => set("orderType", orderType)}
            />
          </Field>

          {values.orderType === "dine_in" && (
            <Field label="Table number (optional)" htmlFor="table" error={errorOf("table")}>
              <Input
                id="table"
                name="table"
                value={values.table}
                onChange={(event) => set("table", event.target.value)}
                maxLength={10}
                {...aria("table")}
              />
            </Field>
          )}

          <Field label="Order instructions (optional)" htmlFor="notes" error={errorOf("notes")}>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={(event) => set("notes", event.target.value)}
              maxLength={200}
              {...aria("notes")}
            />
          </Field>

          <PaymentMethodPicker
            options={paymentOptions}
            value={values.paymentMethod}
            onChange={(paymentMethod) => set("paymentMethod", paymentMethod)}
            error={errorOf("paymentMethod")}
          />

          <div className={styles.trap} aria-hidden="true">
            <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(event) => set("website", event.target.value)}
            />
          </div>
        </Card>

        <aside className={styles.aside}>
          <Card>
            <div className={styles.total}>
              <span>
                Total ({count} item{count === 1 ? "" : "s"})
              </span>
              <b className={styles.amount}>{formatPeso(subtotal)}</b>
            </div>
            {blocked && (
              <p className={styles.message} role="alert">
                {blocked}
              </p>
            )}
            {formError && (
              <p className={styles.message} role="alert">
                {formError}
              </p>
            )}
          </Card>

          <div className={styles.actions}>
            <ButtonLink href="/cart" variant="secondary">
              Back to cart
            </ButtonLink>
            <Button type="submit" disabled={pending || Boolean(blocked)}>
              {pending ? "Placing order…" : "Place order"}
            </Button>
          </div>
        </aside>
      </form>
    </>
  );
}
