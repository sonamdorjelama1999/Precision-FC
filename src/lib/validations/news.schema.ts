import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, imageSchema } from "@/lib/validations/image";

/**
 * Validation for NewsPost. Same form/server split as every other entity
 * here: a transform-free schema for React Hook Form, and a server schema
 * that reads what FormData actually carries (dates arrive as strings).
 */

export { ACCEPTED_IMAGE_TYPES as ACCEPTED_COVER_TYPES };
export const MAX_COVER_BYTES = MAX_IMAGE_BYTES;

const MESSAGES = {
  titleRequired: "Title is required.",
  titleMax: "Title must be 120 characters or fewer.",
  slugRequired: "URL slug is required.",
  slugInvalid: "Use lowercase letters, numbers and hyphens only, e.g. \"match-report-vs-yangrima\".",
  excerptRequired: "A short excerpt is required — it's what shows on the News list.",
  excerptMax: "Excerpt must be 200 characters or fewer.",
  bodyRequired: "Body text is required.",
  publishedAtRequired: "Published date is required.",
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const newsFormSchema = z.object({
  title: z.string().trim().min(2, MESSAGES.titleRequired).max(120, MESSAGES.titleMax),
  slug: z
    .string()
    .trim()
    .min(2, MESSAGES.slugRequired)
    .max(120)
    .regex(SLUG_PATTERN, MESSAGES.slugInvalid),
  excerpt: z.string().trim().min(2, MESSAGES.excerptRequired).max(200, MESSAGES.excerptMax),
  body: z.string().trim().min(2, MESSAGES.bodyRequired),
  /** "YYYY-MM-DD" from <input type="date">. */
  publishedAt: z.string().min(1, MESSAGES.publishedAtRequired),
  isPublished: z.boolean(),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export const newsServerSchema = newsFormSchema.extend({
  publishedAt: z
    .string()
    .min(1, MESSAGES.publishedAtRequired)
    .transform((value) => new Date(`${value}T00:00:00.000Z`)),
});

export type NewsInput = z.infer<typeof newsServerSchema>;

export const coverSchema = imageSchema(ACCEPTED_IMAGE_TYPES);
