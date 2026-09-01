import { z } from "zod";

import { FIXTURE_STATUSES, MATCH_TYPES } from "@/types";

/**
 * Validation for the Match entity — one row across its whole lifecycle, from
 * scheduled fixture to final result (see the model comment in
 * prisma/schema.prisma). Messages are defined once so the browser and the
 * server say the same thing, same pattern as player.schema.ts.
 */
const MESSAGES = {
  homeTeamRequired: "Home team is required.",
  awayTeamRequired: "Away team is required.",
  sameTeam: "Home and away teams must be different.",
  dateRequired: "Match date is required.",
  timeRequired: "Kick-off time is required.",
  typeRequired: "Match type is required.",
  venueMax: "Venue must be 80 characters or fewer.",
  competitionMax: "Competition name must be 80 characters or fewer.",
  notesMax: "Notes must be 500 characters or fewer.",
  scoreInvalid: "Score must be a whole number from 0 to 999.",
} as const;

/**
 * Built unrefined first: Zod wraps a .refine()/.superRefine() call in a
 * ZodEffects, which has no .extend() — see player.schema.ts's form/server
 * split for the same limitation. Here the form and server checks are
 * identical (FormData carries the same strings the form does, no coercion
 * needed), so the same refined schema is exported under both names.
 */
const baseObject = z.object({
  homeTeamId: z.string().min(1, MESSAGES.homeTeamRequired),
  awayTeamId: z.string().min(1, MESSAGES.awayTeamRequired),
  /** "YYYY-MM-DD" from <input type="date">. */
  date: z.string().min(1, MESSAGES.dateRequired),
  /** "HH:MM" from <input type="time">. */
  time: z.string().min(1, MESSAGES.timeRequired),
  matchType: z.enum(MATCH_TYPES, { message: MESSAGES.typeRequired }),
  venue: z.string().trim().max(80, MESSAGES.venueMax),
  competitionName: z.string().trim().max(80, MESSAGES.competitionMax),
  status: z.enum(FIXTURE_STATUSES),
  /** "" (not entered) or up to 3 digits — resolved to number | null by scoreToNumber. */
  homeScore: z.string(),
  awayScore: z.string(),
  notes: z.string().trim().max(500, MESSAGES.notesMax),
  isPublished: z.boolean(),
});

const SCORE_PATTERN = /^\d{1,3}$/;

function checkMatch(data: z.infer<typeof baseObject>, ctx: z.RefinementCtx) {
  if (data.homeTeamId && data.awayTeamId && data.homeTeamId === data.awayTeamId) {
    ctx.addIssue({ code: "custom", message: MESSAGES.sameTeam, path: ["awayTeamId"] });
  }
  if (data.homeScore !== "" && !SCORE_PATTERN.test(data.homeScore)) {
    ctx.addIssue({ code: "custom", message: MESSAGES.scoreInvalid, path: ["homeScore"] });
  }
  if (data.awayScore !== "" && !SCORE_PATTERN.test(data.awayScore)) {
    ctx.addIssue({ code: "custom", message: MESSAGES.scoreInvalid, path: ["awayScore"] });
  }
}

/** Form schema — what React Hook Form validates in the browser. */
export const matchFormSchema = baseObject.superRefine(checkMatch);
export type MatchFormValues = z.infer<typeof matchFormSchema>;

/** Server schema — re-validated inside the Server Action. */
export const matchServerSchema = baseObject.superRefine(checkMatch);
export type MatchInput = z.infer<typeof matchServerSchema>;

/** "" (not entered) becomes null; a digit string becomes a number. */
export function scoreToNumber(value: string): number | null {
  return value === "" ? null : Number(value);
}
