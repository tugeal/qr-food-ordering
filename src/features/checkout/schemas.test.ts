import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./schemas";

const valid = {
  name: "  Juan Dela Cruz ",
  phone: "0917 123 4567",
  orderType: "dine_in",
  table: "5",
  notes: "",
  paymentMethod: "gcash",
  website: "",
  items: [{ itemId: "10000000-0000-4000-8000-000000000001", quantity: 2 }],
};

describe("checkoutSchema", () => {
  it("accepts a valid order and cleans it up", () => {
    const result = checkoutSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Juan Dela Cruz");
      expect(result.data.phone).toBe("09171234567");
      expect(result.data.paymentMethod).toBe("gcash");
    }
  });

  it("rejects a bad mobile number", () => {
    expect(checkoutSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
  });

  it("rejects a missing or unknown payment method", () => {
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod: "" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod: "paypal" }).success).toBe(false);
  });

  it("rejects an empty cart", () => {
    expect(checkoutSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it("rejects quantities outside 1 to 20", () => {
    const items = [{ itemId: valid.items[0]?.itemId, quantity: 21 }];
    expect(checkoutSchema.safeParse({ ...valid, items }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(checkoutSchema.safeParse({ ...valid, website: "https://spam.example" }).success).toBe(
      false,
    );
  });
});
