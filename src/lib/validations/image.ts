import { z } from "zod";

/**
 * Image rules shared by players, staff and sponsors. Applied on both sides:
 * the browser rejects a bad file before uploading it, and the server checks
 * again because a client-side check is a convenience, never a guarantee.
 */

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/** Sponsor logos are usually transparent PNG or SVG-exported WebP. */
export const ACCEPTED_LOGO_TYPES = [...ACCEPTED_IMAGE_TYPES, "image/svg+xml"] as const;

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"] as const;

export function imageSchema(accepted: readonly string[] = ACCEPTED_IMAGE_TYPES) {
  return z
    .instanceof(File)
    .refine((file) => file.size > 0, "The selected file is empty.")
    .refine(
      (file) => accepted.includes(file.type),
      accepted.includes("image/svg+xml")
        ? "Invalid image format. Use JPG, PNG, WebP or SVG."
        : "Invalid image format. Use JPG, PNG or WebP.",
    )
    .refine((file) => file.size <= MAX_IMAGE_BYTES, "Image must be 2 MB or smaller.");
}

export function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && (EXTENSIONS as readonly string[]).includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/svg+xml") return "svg";
  return "jpg";
}
