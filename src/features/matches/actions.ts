"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { combineDateAndTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { matchServerSchema, scoreToNumber, type MatchInput } from "@/lib/validations/match.schema";

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Same rules as every other entity's actions: requireAdmin() first because
 * Server Actions are public endpoints, ids are looked up rather than
 * trusted, and validation runs again here even though the browser already
 * checked.
 */

function revalidateEverything() {
  revalidatePath("/");
  revalidatePath("/fixtures");
  revalidatePath("/admin/matches");
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function parseMatchForm(formData: FormData) {
  return matchServerSchema.safeParse({
    homeTeamId: formData.get("homeTeamId"),
    awayTeamId: formData.get("awayTeamId"),
    date: formData.get("date"),
    time: formData.get("time"),
    matchType: formData.get("matchType"),
    venue: formData.get("venue") ?? "",
    competitionName: formData.get("competitionName") ?? "",
    status: formData.get("status"),
    homeScore: formData.get("homeScore") ?? "",
    awayScore: formData.get("awayScore") ?? "",
    notes: formData.get("notes") ?? "",
    isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "true",
  });
}

/**
 * Scores only mean something once the match has actually been played —
 * entering them while it's still SCHEDULED would just be guessing next
 * week's result — so anything short of COMPLETED is stored with both scores
 * null no matter what was typed into the fields.
 */
function toMatchData(parsed: MatchInput) {
  return {
    homeTeamId: parsed.homeTeamId,
    awayTeamId: parsed.awayTeamId,
    scheduledAt: combineDateAndTime(parsed.date, parsed.time),
    venue: parsed.venue.length > 0 ? parsed.venue : null,
    matchType: parsed.matchType,
    competitionName: parsed.competitionName.length > 0 ? parsed.competitionName : null,
    status: parsed.status,
    homeScore: parsed.status === "COMPLETED" ? scoreToNumber(parsed.homeScore) : null,
    awayScore: parsed.status === "COMPLETED" ? scoreToNumber(parsed.awayScore) : null,
    notes: parsed.notes.length > 0 ? parsed.notes : null,
    isPublished: parsed.isPublished,
  };
}

/**
 * Prisma's error codes, read structurally rather than with
 * `instanceof PrismaClientKnownRequestError` — works the same whichever
 * Prisma build is installed.
 */
function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2003"
  );
}

// ---------------------------------------------------------------------------

export async function createMatch(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseMatchForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  try {
    await prisma.match.create({ data: toMatchData(parsed.data) });
    revalidateEverything();
    return { ok: true, message: "Match scheduled." };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return { ok: false, message: "One of the selected teams no longer exists." };
    }
    console.error("[matches] create failed:", error);
    return { ok: false, message: "Could not schedule the match. Please try again." };
  }
}

export async function updateMatch(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Match not found." };

  const parsed = parseMatchForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  try {
    await prisma.match.update({ where: { id }, data: toMatchData(parsed.data) });
    revalidateEverything();
    revalidatePath(`/admin/matches/${id}/edit`);
    return { ok: true, message: "Match updated." };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return { ok: false, message: "One of the selected teams no longer exists." };
    }
    console.error("[matches] update failed:", error);
    return { ok: false, message: "Could not save the match. Please try again." };
  }
}

export async function deleteMatch(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.match.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Match not found." };

  try {
    await prisma.match.delete({ where: { id } });
    revalidateEverything();
    return { ok: true, message: "Match removed." };
  } catch (error) {
    console.error("[matches] delete failed:", error);
    return { ok: false, message: "Could not delete the match. Please try again." };
  }
}
