import { z } from "zod";

import { PLAYER_POSITIONS } from "@/types";

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

/** Messages are defined once so the browser and the server say the same thing. */
const MESSAGES = {
  numberRequired: "Player number is required.",
  numberInteger: "Player number must be a whole number.",
  numberMin: "Player number cannot be negative.",
  numberMax: "Player number must be 99 or below.",
  nameRequired: "Player name is required.",
  nameMax: "Player name must be 60 characters or fewer.",
  positionRequired: "Position is required.",
  roleMax: "Role must be 60 characters or fewer.",
} as const;

/**
 * Form schema — what React Hook Form validates in the browser.
 *
 * Deliberately free of transforms: RHF requires a resolver whose input and
 * output types match, and a schema that turns "" into null does not satisfy
 * that. The server schema below adds the coercion instead.
 */
export const playerFormSchema = z.object({
  playerNumber: z
    .number({ message: MESSAGES.numberRequired })
    .int(MESSAGES.numberInteger)
    .min(0, MESSAGES.numberMin)
    .max(99, MESSAGES.numberMax),
  name: z.string().trim().min(2, MESSAGES.nameRequired).max(60, MESSAGES.nameMax),
  position: z.enum(PLAYER_POSITIONS, { message: MESSAGES.positionRequired }),
  role: z.string().trim().max(60, MESSAGES.roleMax),
  isCaptain: z.boolean(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

/**
 * Server schema — what the Server Action validates.
 *
 * FormData only ever carries strings, so the number is coerced here, and an
 * empty role becomes null rather than "". Same rules, same messages; a
 * crafted request that skips the browser hits exactly the same wall.
 */
export const playerServerSchema = playerFormSchema.extend({
  playerNumber: z.coerce
    .number({ message: MESSAGES.numberRequired })
    .int(MESSAGES.numberInteger)
    .min(0, MESSAGES.numberMin)
    .max(99, MESSAGES.numberMax),
  role: z
    .string()
    .trim()
    .max(60, MESSAGES.roleMax)
    .transform((value) => (value.length > 0 ? value : null)),
});

export type PlayerInput = z.infer<typeof playerServerSchema>;

/**
 * Photo rules, applied on both sides: the browser rejects a bad file before
 * uploading it, and the server checks again because a client-side check is a
 * convenience, never a guarantee.
 */
export const photoSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "The selected file is empty.")
  .refine(
    (file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    "Invalid image format. Use JPG, PNG or WebP.",
  )
  .refine((file) => file.size <= MAX_PHOTO_BYTES, "Image must be 2 MB or smaller.");

export function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && (ACCEPTED_IMAGE_EXTENSIONS as readonly string[]).includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}
