import { describe, expect, it } from "vitest";
import { isFinalStatus, isOrderStatus, progressIndex } from "./status";

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

  it("knows which statuses are final", () => {
    expect(isFinalStatus("completed")).toBe(true);
    expect(isFinalStatus("cancelled")).toBe(true);
    expect(isFinalStatus("preparing")).toBe(false);
  });
});
