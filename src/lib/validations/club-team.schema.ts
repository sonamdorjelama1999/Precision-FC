import { z } from "zod";

import { ACCEPTED_LOGO_TYPES, imageSchema } from "@/lib/validations/image";

/**
 * Validation for the football-club Team entity (Precision FC and its
 * opponents) — not to be confused with lib/validations/team.schema.ts, which
 * validates the coaching-staff/sponsor "team" domain. See the naming note in
 * prisma/schema.prisma.
 *
 * Same form/server split as every other entity here: a transform-free schema
 * for React Hook Form, and a server schema that reads what FormData actually
 * carries.
 */

export const teamFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Team name is required.")
    .max(60, "Team name must be 60 characters or fewer."),
  isPrimary: z.boolean(),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

export const teamServerSchema = teamFormSchema;

export type TeamInput = z.infer<typeof teamServerSchema>;

/** Team logos follow the same rules as sponsor logos: photo or transparent PNG/SVG. */
export const teamLogoSchema = imageSchema(ACCEPTED_LOGO_TYPES);
export { ACCEPTED_LOGO_TYPES as ACCEPTED_TEAM_LOGO_TYPES };
