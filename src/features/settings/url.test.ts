import { describe, expect, it } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  it("accepts web addresses", () => {
    expect(normalizeUrl("https://menu.example.com")).toBe("https://menu.example.com/");
  });

  it("rejects empty values", () => {
    expect(normalizeUrl("   ")).toBeNull();
    expect(normalizeUrl(undefined)).toBeNull();
  });

  it("rejects non-web schemes and garbage", () => {
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("not a url")).toBeNull();
  });
});
