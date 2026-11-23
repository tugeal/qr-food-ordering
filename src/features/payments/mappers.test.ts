import { describe, expect, it } from "vitest";
import { toAdminPaymentMethods, toPaymentMethod, toPaymentOptions } from "./mappers";

describe("toPaymentOptions", () => {
  it("orders by sort_order and drops unknown codes", () => {
    const options = toPaymentOptions([
      { code: "maya", display_name: "Maya", sort_order: 2 },
      { code: "paypal", display_name: "PayPal", sort_order: 0 },
      { code: "gcash", display_name: "GCash", sort_order: 1 },
    ]);
    expect(options.map((option) => option.code)).toEqual(["gcash", "maya"]);
  });

  it("falls back to the default name when display_name is empty", () => {
    const [option] = toPaymentOptions([{ code: "bank_transfer", display_name: "", sort_order: 1 }]);
    expect(option?.name).toBe("Bank transfer");
  });
});

describe("toPaymentMethod", () => {
  const row = {
    code: "gcash",
    display_name: "GCash",
    account_name: "Sample Kitchen",
    account_number: "09171234567",
    bank_name: "",
    instructions: "Send the exact amount.",
  };

  it("maps the account details", () => {
    expect(toPaymentMethod(row)).toEqual({
      code: "gcash",
      name: "GCash",
      accountName: "Sample Kitchen",
      accountNumber: "09171234567",
      bankName: "",
      instructions: "Send the exact amount.",
    });
  });

  it("rejects codes it doesn't know", () => {
    expect(toPaymentMethod({ ...row, code: "paypal" })).toBeNull();
  });
});

describe("toAdminPaymentMethods", () => {
  it("always returns all three methods, filling in any that are missing", () => {
    const methods = toAdminPaymentMethods([
      {
        code: "maya",
        display_name: "Maya",
        account_name: "Sample Kitchen",
        account_number: "09171234567",
        bank_name: "",
        instructions: "",
        is_active: true,
      },
    ]);
    expect(methods.map((method) => method.code)).toEqual(["gcash", "maya", "bank_transfer"]);
    expect(methods[1]).toMatchObject({ accountNumber: "09171234567", isActive: true });
    expect(methods[0]).toMatchObject({ name: "GCash", accountNumber: "", isActive: false });
  });
});
