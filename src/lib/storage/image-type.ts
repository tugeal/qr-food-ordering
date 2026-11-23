export type ImageType = "jpeg" | "png" | "webp";

export const IMAGE_MIME: Record<ImageType, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const IMAGE_EXTENSION: Record<ImageType, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

function ascii(bytes: Uint8Array, from: number, to: number): string {
  return String.fromCharCode(...bytes.slice(from, to));
}

/** Identifies a photo by its first bytes, so a renamed file can't pass as an image. */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= 8 && pngSignature.every((byte, index) => bytes[index] === byte)) {
    return "png";
  }

  if (bytes.length >= 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") {
    return "webp";
  }

  return null;
}
