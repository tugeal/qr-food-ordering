import { describe, expect, it } from "vitest";
import { normalizePhMobile } from "./phone";

describe("normalizePhMobile", () => {
  it("accepts the common formats", () => {
    expect(normalizePhMobile("09171234567")).toBe("09171234567");
    expect(normalizePhMobile("0917 123 4567")).toBe("09171234567");
    expect(normalizePhMobile("+63 917 123 4567")).toBe("09171234567");
    expect(normalizePhMobile("639171234567")).toBe("09171234567");
  });

  it("rejects anything else", () => {
    expect(normalizePhMobile("0817123456")).toBeNull();
    expect(normalizePhMobile("0917123456")).toBeNull();
    expect(normalizePhMobile("hello")).toBeNull();
    expect(normalizePhMobile("")).toBeNull();
  });
});
