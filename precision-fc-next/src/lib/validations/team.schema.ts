import { z } from "zod";

import {
  ACCEPTED_LOGO_TYPES,
  ACCEPTED_IMAGE_TYPES,
  imageSchema,
} from "@/lib/validations/image";
import { SPONSOR_TIERS } from "@/types";

/**
 * Staff and sponsors follow the same pattern as players: a transform-free
 * form schema for React Hook Form, and a server schema that coerces the
 * strings FormData carries and turns "" into null.
 */

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export const staffFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(60, "Name must be 60 characters or fewer."),
  role: z
    .string()
    .trim()
    .min(2, "Role is required — for example Manager or Head Coach.")
    .max(60, "Role must be 60 characters or fewer."),
  displayOrder: z
    .number({ message: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(999, "Order must be 999 or below."),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

export const staffServerSchema = staffFormSchema.extend({
  displayOrder: z.coerce
    .number({ message: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(999, "Order must be 999 or below."),
});

export type StaffInput = z.infer<typeof staffServerSchema>;

export const staffPhotoSchema = imageSchema(ACCEPTED_IMAGE_TYPES);

// ---------------------------------------------------------------------------
// Sponsors
// ---------------------------------------------------------------------------

/** Accepts "acme.com" as well as a full URL; stored normalised to https. */
const websiteField = z
  .string()
  .trim()
  .max(200, "Website must be 200 characters or fewer.")
  .refine(
    (value) => value === "" || /^([a-z][a-z0-9+.-]*:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(value),
    "Enter a valid website address.",
  );

export const sponsorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Sponsor name is required.")
    .max(60, "Sponsor name must be 60 characters or fewer."),
  tier: z.enum(SPONSOR_TIERS, { message: "Tier is required." }),
  websiteUrl: websiteField,
  displayOrder: z
    .number({ message: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(999, "Order must be 999 or below."),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

export const sponsorServerSchema = sponsorFormSchema.extend({
  websiteUrl: websiteField.transform((value) => {
    if (!value) return null;
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  }),
  displayOrder: z.coerce
    .number({ message: "Order must be a number." })
    .int("Order must be a whole number.")
    .min(0, "Order cannot be negative.")
    .max(999, "Order must be 999 or below."),
});

export type SponsorInput = z.infer<typeof sponsorServerSchema>;

export const sponsorLogoSchema = imageSchema(ACCEPTED_LOGO_TYPES);
export { ACCEPTED_LOGO_TYPES };
