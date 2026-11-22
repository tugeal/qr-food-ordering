import { describe, expect, it } from "vitest";
import {
  isOrderStatus,
  isPaymentStatus,
  isSettled,
  parseLiveState,
  progressIndex,
} from "./status";

describe("order status", () => {
  it("recognises valid statuses only", () => {
    expect(isOrderStatus("preparing")).toBe(true);
    expect(isOrderStatus("shipped")).toBe(false);
    expect(isOrderStatus(undefined)).toBe(false);
  });

  it("places statuses on the happy path", () => {
    expect(progressIndex("pending")).toBe(0);
    expect(progressIndex("completed")).toBe(3);
    expect(progressIndex("cancelled")).toBe(-1);
  });
});

describe("payment status", () => {
  it("recognises valid payment statuses only", () => {
    expect(isPaymentStatus("paid")).toBe(true);
    expect(isPaymentStatus("refunded")).toBe(false);
  });
});

describe("parseLiveState", () => {
  it("reads a valid response", () => {
    expect(parseLiveState({ status: "preparing", paymentStatus: "paid" })).toEqual({
      status: "preparing",
      paymentStatus: "paid",
    });
  });

  it("ignores anything else", () => {
    expect(parseLiveState(null)).toBeNull();
    expect(parseLiveState({ status: "preparing" })).toBeNull();
    expect(parseLiveState({ status: "shipped", paymentStatus: "paid" })).toBeNull();
  });
});

describe("isSettled", () => {
  it("is true for cancelled orders and for completed, paid orders", () => {
    expect(isSettled("cancelled", "unpaid")).toBe(true);
    expect(isSettled("completed", "paid")).toBe(true);
  });

  it("keeps waiting while something can still change", () => {
    expect(isSettled("completed", "unpaid")).toBe(false);
    expect(isSettled("preparing", "paid")).toBe(false);
  });
});
