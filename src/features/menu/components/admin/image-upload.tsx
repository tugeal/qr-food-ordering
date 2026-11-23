"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "./image-upload.module.css";

const MAX_BYTES = 2 * 1024 * 1024;

function readString(data: unknown, key: "url" | "error"): string | null {
  if (typeof data !== "object" || data === null || !(key in data)) return null;
  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

type Props = { imageUrl: string; onChange: (url: string) => void };

/** Uploads a food photo (JPG, PNG or WebP, up to 2 MB) and hands back its public address. */
export function ImageUpload({ imageUrl, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError("That photo is over 2 MB.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/admin/menu-images", { method: "POST", body });
      const data: unknown = await response.json().catch(() => null);

      const url = response.ok ? readString(data, "url") : null;
      if (!url) {
        setError(readString(data, "error") ?? "The upload failed. Please try again.");
        return;
      }
      onChange(url);
    } catch {
      setError("The upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className={styles.upload}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Food photo preview"
          width={96}
          height={96}
          className={styles.preview}
        />
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.file}
        aria-label="Choose a food photo"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <div className={styles.actions}>
        <Button variant="secondary" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
          {uploading ? "Uploading…" : imageUrl ? "Change photo" : "Upload photo"}
        </Button>
        {imageUrl && !uploading && (
          <Button variant="secondary" size="sm" onClick={() => onChange("")}>
            Remove photo
          </Button>
        )}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <p className={styles.help}>JPG, PNG or WebP, up to 2 MB.</p>
    </div>
  );
}
