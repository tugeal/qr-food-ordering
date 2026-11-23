import { describe, expect, it } from "vitest";
import { detectImageType } from "./image-type";

const ascii = (text: string) => Array.from(text, (char) => char.charCodeAt(0));

describe("detectImageType", () => {
  it("recognises JPEG, PNG and WebP by their first bytes", () => {
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00]))).toBe("jpeg");
    expect(
      detectImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])),
    ).toBe("png");
    expect(detectImageType(new Uint8Array([...ascii("RIFF"), 1, 2, 3, 4, ...ascii("WEBP")]))).toBe(
      "webp",
    );
  });

  it("rejects everything else", () => {
    expect(detectImageType(new Uint8Array(ascii("<svg xmlns")))).toBeNull();
    expect(detectImageType(new Uint8Array(ascii("GIF89a")))).toBeNull();
    expect(detectImageType(new Uint8Array([]))).toBeNull();
  });
});
