import { z } from "zod";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  imageSchema,
} from "@/lib/validations/image";
import { PLAYER_POSITIONS } from "@/types";

export { ACCEPTED_IMAGE_TYPES };
export const MAX_PHOTO_BYTES = MAX_IMAGE_BYTES;

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
 *
 * teamId is a plain string here — "" means "no team" — because Radix Select
 * (like the position field) has no empty/null value of its own; the server
 * schema turns "" into null, same as sponsor's websiteUrl.
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
  teamId: z.string(),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

/**
 * Server schema — what the Server Action validates.
 *
 * FormData only ever carries strings, so the number is coerced here, an
 * empty role becomes null rather than "", and an empty teamId ("no team")
 * becomes null rather than "".
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
  teamId: z.string().transform((value) => (value.length > 0 ? value : null)),
});

export type PlayerInput = z.infer<typeof playerServerSchema>;

export const photoSchema = imageSchema(ACCEPTED_IMAGE_TYPES);
