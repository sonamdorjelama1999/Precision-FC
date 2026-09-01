import { z } from "zod";

import { CONTACT_REASONS } from "@/types";

/**
 * Validation for the public Contact form. Unlike every other entity in this
 * app there is no separate server schema: nothing here needs coercion (the
 * form and the FormData the action reads carry the same plain strings), so
 * one schema does both jobs — same shortcut match.schema.ts takes for the
 * same reason.
 *
 * The honeypot field is deliberately not part of this schema: it is read
 * directly off the FormData in the action before validation even starts, so
 * a bot that fills it never reaches (or learns anything from) these rules.
 */
const MESSAGES = {
  nameRequired: "Name is required.",
  nameMax: "Name must be 80 characters or fewer.",
  emailInvalid: "Enter a valid email address.",
  reasonRequired: "Select a reason.",
  messageRequired: "Message must be at least 10 characters.",
  messageMax: "Message must be 2000 characters or fewer.",
} as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, MESSAGES.nameRequired).max(80, MESSAGES.nameMax),
  email: z.email(MESSAGES.emailInvalid).max(200, MESSAGES.emailInvalid),
  reason: z.enum(CONTACT_REASONS, { message: MESSAGES.reasonRequired }),
  message: z.string().trim().min(10, MESSAGES.messageRequired).max(2000, MESSAGES.messageMax),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactServerSchema = contactFormSchema;
export type ContactInput = z.infer<typeof contactServerSchema>;
