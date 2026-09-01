"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { teamHasMatches } from "@/features/teams/queries";
import { deleteTeamFolder, deleteTeamLogo, uploadTeamLogo } from "@/features/teams/storage";
import { prisma } from "@/lib/prisma";
import { teamLogoSchema, teamServerSchema } from "@/lib/validations/club-team.schema";

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
  revalidatePath("/squad");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/players");
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function parseTeamForm(formData: FormData) {
  return teamServerSchema.safeParse({
    name: formData.get("name"),
    isPrimary: formData.get("isPrimary") === "on" || formData.get("isPrimary") === "true",
  });
}

/** Returns a validated File, or null when no new logo was submitted. */
function parseLogo(formData: FormData) {
  const raw = formData.get("logo");
  if (!(raw instanceof File) || raw.size === 0) return { file: null as File | null };

  const parsed = teamLogoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid image." };
  }
  return { file: parsed.data };
}

/**
 * Prisma's error codes, read structurally rather than with
 * `instanceof PrismaClientKnownRequestError` — works the same whichever
 * Prisma build is installed.
 */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2003"
  );
}

function duplicateNameResult(name: string): ActionResult {
  const message = `A team named "${name}" already exists.`;
  return { ok: false, message, fieldErrors: { name: message } };
}

/** Only one primary team at a time — same pattern as Player.isCaptain. */
async function clearOtherPrimaryTeams(exceptId: string) {
  await prisma.team.updateMany({
    where: { isPrimary: true, NOT: { id: exceptId } },
    data: { isPrimary: false },
  });
}

/**
 * Every player created before Team Management existed — and any added since
 * without picking a team — has teamId = null. As soon as a team is marked
 * primary ("Precision FC is the home team, the players ... should be inside
 * Precision FC"), those players belong on it by default.
 *
 * A player is only claimed if their shirt number doesn't already collide
 * with one already on this team — playerNumber is unique per team (see
 * schema.prisma), so blindly claiming everyone could throw. A colliding
 * player is left unassigned rather than failing the whole save; the admin
 * can move them in from the Players screen and give them a free number.
 */
async function claimUnassignedPlayers(teamId: string): Promise<{ claimed: number; skipped: number }> {
  const [unassigned, existing] = await Promise.all([
    prisma.player.findMany({ where: { teamId: null }, select: { id: true, playerNumber: true } }),
    prisma.player.findMany({ where: { teamId }, select: { playerNumber: true } }),
  ]);
  if (unassigned.length === 0) return { claimed: 0, skipped: 0 };

  const takenNumbers = new Set(existing.map((player) => player.playerNumber));
  const claimable = unassigned.filter((player) => !takenNumbers.has(player.playerNumber));

  if (claimable.length > 0) {
    await prisma.player.updateMany({
      where: { id: { in: claimable.map((player) => player.id) } },
      data: { teamId },
    });
  }

  return { claimed: claimable.length, skipped: unassigned.length - claimable.length };
}

function withClaimNote(message: string, claim: { claimed: number; skipped: number }): string {
  if (claim.claimed === 0 && claim.skipped === 0) return message;
  const parts: string[] = [];
  if (claim.claimed > 0) {
    parts.push(`${claim.claimed} unassigned player${claim.claimed === 1 ? "" : "s"} joined this team`);
  }
  if (claim.skipped > 0) {
    parts.push(
      `${claim.skipped} skipped — their shirt number is already used on this team`,
    );
  }
  return `${message} ${parts.join("; ")}.`;
}

// ---------------------------------------------------------------------------

export async function createTeam(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const logo = parseLogo(formData);
  if ("error" in logo && logo.error) {
    return { ok: false, message: logo.error, fieldErrors: { logo: logo.error } };
  }

  let createdId: string | null = null;

  try {
    const team = await prisma.team.create({ data: parsed.data });
    createdId = team.id;

    if (logo.file) {
      const stored = await uploadTeamLogo(team.id, logo.file);
      await prisma.team.update({ where: { id: team.id }, data: stored });
    }

    let message = `${parsed.data.name} added.`;
    if (parsed.data.isPrimary) {
      await clearOtherPrimaryTeams(team.id);
      message = withClaimNote(message, await claimUnassignedPlayers(team.id));
    }

    revalidateEverything();
    return { ok: true, message };
  } catch (error) {
    if (createdId) {
      await prisma.team.delete({ where: { id: createdId } }).catch(() => {});
    }
    if (isUniqueViolation(error)) return duplicateNameResult(parsed.data.name);

    console.error("[teams] create failed:", error);
    return { ok: false, message: "Could not create the team. Please try again." };
  }
}

export async function updateTeam(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.team.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Team not found." };

  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const logo = parseLogo(formData);
  if ("error" in logo && logo.error) {
    return { ok: false, message: logo.error, fieldErrors: { logo: logo.error } };
  }

  try {
    let logoFields: { logoUrl?: string | null; logoPath?: string | null } = {};

    if (logo.file) {
      logoFields = await uploadTeamLogo(id, logo.file);
    } else if (formData.get("removeLogo") === "true") {
      logoFields = { logoUrl: null, logoPath: null };
    }

    await prisma.team.update({
      where: { id },
      data: { ...parsed.data, ...logoFields },
    });

    // The old object is only removed once the new row is safely written.
    if ("logoPath" in logoFields && existing.logoPath) {
      await deleteTeamLogo(existing.logoPath);
    }

    let message = `${parsed.data.name} updated.`;
    if (parsed.data.isPrimary) {
      await clearOtherPrimaryTeams(id);
      message = withClaimNote(message, await claimUnassignedPlayers(id));
    }

    revalidateEverything();
    revalidatePath(`/admin/teams/${id}/edit`);
    return { ok: true, message };
  } catch (error) {
    if (isUniqueViolation(error)) return duplicateNameResult(parsed.data.name);

    console.error("[teams] update failed:", error);
    return { ok: false, message: "Could not save the team. Please try again." };
  }
}

export async function deleteTeam(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.team.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Team not found." };

  // Proactive check so the admin gets a clear reason rather than a generic
  // failure; the FK's onDelete: Restrict (see schema.prisma) is the backstop
  // if this check is ever bypassed.
  if (await teamHasMatches(id)) {
    return {
      ok: false,
      message: `${existing.name} has matches scheduled. Resolve or delete those matches first.`,
    };
  }

  try {
    // Players on this team are kept — Player.teamId is SetNull, so this
    // never deletes a player, only clears which team they belong to.
    await prisma.team.delete({ where: { id } });
    await deleteTeamFolder(id);

    revalidateEverything();
    return { ok: true, message: `${existing.name} removed.` };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return {
        ok: false,
        message: `${existing.name} still has matches scheduled. Resolve or delete those matches first.`,
      };
    }

    console.error("[teams] delete failed:", error);
    return { ok: false, message: "Could not delete the team. Please try again." };
  }
}
