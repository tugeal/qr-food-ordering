import { describe, expect, it } from "vitest";
import { savePaymentMethodSchema } from "./schemas";

const valid = {
  code: "gcash",
  displayName: "GCash",
  accountName: "Sample Kitchen",
  accountNumber: "09171234567",
  bankName: "",
  instructions: "",
  isActive: true,
};

describe("savePaymentMethodSchema", () => {
  it("accepts a complete method", () => {
    expect(savePaymentMethodSchema.safeParse(valid).success).toBe(true);
  });

  it("won't switch a method on without an account number", () => {
    expect(savePaymentMethodSchema.safeParse({ ...valid, accountNumber: "" }).success).toBe(false);
    expect(
      savePaymentMethodSchema.safeParse({ ...valid, accountNumber: "", isActive: false }).success,
    ).toBe(true);
  });

  it("rejects unknown methods", () => {
    expect(savePaymentMethodSchema.safeParse({ ...valid, code: "paypal" }).success).toBe(false);
  });
});
