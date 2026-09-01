"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import {
  deletePlayerFolder,
  deletePlayerPhoto,
  uploadPlayerPhoto,
} from "@/features/players/storage";
import { prisma } from "@/lib/prisma";
import { photoSchema, playerServerSchema } from "@/lib/validations/player.schema";

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Every mutation starts with requireAdmin(). Server Actions are public HTTP
 * endpoints — anyone who knows the action id can call one — so the check
 * belongs here, not only in the page that renders the form.
 *
 * Client-submitted ids are never trusted either: each one is looked up before
 * it is used.
 */

const PUBLIC_PATHS = ["/", "/squad"];

function revalidateEverything() {
  for (const path of PUBLIC_PATHS) revalidatePath(path);
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

function parsePlayerForm(formData: FormData) {
  return playerServerSchema.safeParse({
    playerNumber: formData.get("playerNumber"),
    name: formData.get("name"),
    position: formData.get("position"),
    role: formData.get("role") ?? undefined,
    isCaptain: formData.get("isCaptain") === "on" || formData.get("isCaptain") === "true",
    teamId: formData.get("teamId") ?? "",
  });
}

/** Returns a validated File, or null when no new photo was submitted. */
function parsePhoto(formData: FormData) {
  const raw = formData.get("photo");
  if (!(raw instanceof File) || raw.size === 0) return { file: null as File | null };

  const parsed = photoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid image." };
  }
  return { file: parsed.data };
}

function duplicateNumberResult(playerNumber: number): ActionResult {
  // Shirt numbers are unique per team (see prisma/schema.prisma), so this
  // only fires when another player on the *same* team already has it —
  // the same number is fine on a different team.
  const message = `Shirt number ${playerNumber} is already taken on this team.`;
  return { ok: false, message, fieldErrors: { playerNumber: message } };
}

/**
 * Prisma's unique-constraint code, read structurally rather than with
 * `instanceof PrismaClientKnownRequestError` — the check then works the same
 * whichever Prisma build is installed.
 */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/** Only one captain at a time. */
async function clearOtherCaptains(exceptId: string) {
  await prisma.player.updateMany({
    where: { isCaptain: true, NOT: { id: exceptId } },
    data: { isCaptain: false },
  });
}

// ---------------------------------------------------------------------------

export async function createPlayer(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parsePlayerForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const photo = parsePhoto(formData);
  if ("error" in photo && photo.error) {
    return { ok: false, message: photo.error, fieldErrors: { photo: photo.error } };
  }

  let createdId: string | null = null;

  try {
    const player = await prisma.player.create({ data: parsed.data });
    createdId = player.id;

    if (photo.file) {
      // The storage path needs the player's id, so the row is written first
      // and rolled back below if the upload fails.
      const stored = await uploadPlayerPhoto(player.id, photo.file);
      await prisma.player.update({ where: { id: player.id }, data: stored });
    }

    if (parsed.data.isCaptain) await clearOtherCaptains(player.id);

    revalidateEverything();
    return { ok: true, message: `${parsed.data.name} added.` };
  } catch (error) {
    if (createdId) {
      // Undo the half-written player so a failed upload leaves nothing behind.
      await prisma.player.delete({ where: { id: createdId } }).catch(() => {});
    }
    if (isUniqueViolation(error)) return duplicateNumberResult(parsed.data.playerNumber);

    console.error("[players] create failed:", error);
    return { ok: false, message: "Could not create the player. Please try again." };
  }
}

export async function updatePlayer(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.player.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Player not found." };

  const parsed = parsePlayerForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const photo = parsePhoto(formData);
  if ("error" in photo && photo.error) {
    return { ok: false, message: photo.error, fieldErrors: { photo: photo.error } };
  }

  try {
    // Typed explicitly so the "did the photo change?" check below narrows.
    let photoFields: { photoUrl?: string | null; photoPath?: string | null } = {};

    if (photo.file) {
      const stored = await uploadPlayerPhoto(id, photo.file);
      photoFields = stored;
    } else if (formData.get("removePhoto") === "true") {
      photoFields = { photoUrl: null, photoPath: null };
    }

    await prisma.player.update({
      where: { id },
      data: { ...parsed.data, ...photoFields },
    });

    // The old object is only removed once the new row is safely written.
    if ("photoPath" in photoFields && existing.photoPath) {
      await deletePlayerPhoto(existing.photoPath);
    }

    if (parsed.data.isCaptain) await clearOtherCaptains(id);

    revalidateEverything();
    revalidatePath(`/admin/players/${id}/edit`);
    return { ok: true, message: `${parsed.data.name} updated.` };
  } catch (error) {
    if (isUniqueViolation(error)) return duplicateNumberResult(parsed.data.playerNumber);

    console.error("[players] update failed:", error);
    return { ok: false, message: "Could not save the player. Please try again." };
  }
}

export async function deletePlayer(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.player.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Player not found." };

  try {
    await prisma.player.delete({ where: { id } });

    // Goals survive: GoalEvent.playerId is SetNull and scorerName keeps the
    // name, so deleting a player never rewrites match history.
    await deletePlayerFolder(id);

    revalidateEverything();
    return { ok: true, message: `${existing.name} removed.` };
  } catch (error) {
    console.error("[players] delete failed:", error);
    return { ok: false, message: "Could not delete the player. Please try again." };
  }
}
