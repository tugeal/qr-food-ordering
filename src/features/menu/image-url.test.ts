import { describe, expect, it } from "vitest";
import { menuImagePath } from "./image-url";

const base = "https://abc.supabase.co";
const id = "123e4567-e89b-42d3-a456-426614174000";

describe("menuImagePath", () => {
  it("returns the path for our own photos", () => {
    expect(menuImagePath(`${base}/storage/v1/object/public/menu-images/items/${id}.jpg`, base)).toBe(
      `items/${id}.jpg`,
    );
    expect(menuImagePath(`${base}/storage/v1/object/public/menu-images/items/${id}.webp`, `${base}/`)).toBe(
      `items/${id}.webp`,
    );
  });

  it("rejects other hosts, other buckets and odd paths", () => {
    expect(menuImagePath(`https://evil.example/storage/v1/object/public/menu-images/items/${id}.jpg`, base)).toBeNull();
    expect(menuImagePath(`${base}/storage/v1/object/public/other/items/${id}.jpg`, base)).toBeNull();
    expect(menuImagePath(`${base}/storage/v1/object/public/menu-images/../secrets.png`, base)).toBeNull();
    expect(menuImagePath("", base)).toBeNull();
  });
});
