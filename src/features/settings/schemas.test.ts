import { describe, expect, it } from "vitest";
import { settingsSchema } from "./schemas";

describe("settingsSchema", () => {
  it("accepts a name and a full address", () => {
    const result = settingsSchema.safeParse({
      restaurantName: " Sample Kitchen ",
      siteUrl: "https://menu.example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.restaurantName).toBe("Sample Kitchen");
      expect(result.data.siteUrl).toBe("https://menu.example.com/");
    }
  });

  it("adds https:// to a bare domain and allows an empty address", () => {
    const bare = settingsSchema.safeParse({ restaurantName: "A", siteUrl: "menu.example.com" });
    expect(bare.success && bare.data.siteUrl).toBe("https://menu.example.com/");

    const empty = settingsSchema.safeParse({ restaurantName: "A", siteUrl: "" });
    expect(empty.success && empty.data.siteUrl).toBe("");
  });

  it("rejects an empty name and a non-web address", () => {
    expect(settingsSchema.safeParse({ restaurantName: "", siteUrl: "" }).success).toBe(false);
    expect(
      settingsSchema.safeParse({ restaurantName: "A", siteUrl: "javascript:alert(1)" }).success,
    ).toBe(false);
  });
});
