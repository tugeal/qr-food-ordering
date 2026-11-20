import { describe, expect, it } from "vitest";
import { formatPeso } from "./currency";

describe("formatPeso", () => {
  it("drops trailing zeros", () => {
    expect(formatPeso(149)).toBe("₱149");
  });

  it("keeps up to two decimals", () => {
    expect(formatPeso(149.5)).toBe("₱149.5");
  });

  it("groups thousands", () => {
    expect(formatPeso(1234.56)).toBe("₱1,234.56");
  });
});
