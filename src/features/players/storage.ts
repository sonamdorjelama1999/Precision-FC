import "server-only";

import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase/server";
import { extensionFor } from "@/lib/validations/player.schema";

/**
 * Player photos in Supabase Storage.
 *
 * Objects live at players/{playerId}/{uuid}.{ext}. The random filename means
 * a replacement never collides with a cached copy of the old one, and the
 * per-player folder makes cleanup on delete a single call.
 *
 * PostgreSQL stores the public URL (for rendering) and the object path (for
 * deleting) — never the image bytes.
 */

export interface StoredPhoto {
  photoUrl: string;
  photoPath: string;
}

export async function uploadPlayerPhoto(
  playerId: string,
  file: File,
): Promise<StoredPhoto> {
  const path = `players/${playerId}/${crypto.randomUUID()}.${extensionFor(file)}`;

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`Unable to upload player image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return { photoUrl: publicUrl, photoPath: path };
}

/**
 * Best-effort delete. A failure here is logged but never fails the request:
 * an orphaned object is untidy, whereas a player who cannot be saved or
 * deleted because storage hiccuped is a broken CMS.
 */
export async function deletePlayerPhoto(path: string | null | undefined): Promise<void> {
  if (!path) return;

  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);

  if (error) {
    console.error(`[storage] could not delete ${path}:`, error.message);
  }
}

/** Removes the whole folder for a player — used when the player is deleted. */
export async function deletePlayerFolder(playerId: string): Promise<void> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .list(`players/${playerId}`);

  if (error) {
    console.error(`[storage] could not list players/${playerId}:`, error.message);
    return;
  }

  if (!data?.length) return;

  const paths = data.map((entry) => `players/${playerId}/${entry.name}`);
  const { error: removeError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove(paths);

  if (removeError) {
    console.error(`[storage] could not remove ${paths.length} object(s):`, removeError.message);
  }
}
