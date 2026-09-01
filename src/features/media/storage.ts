import "server-only";

import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase/server";
import { extensionFor } from "@/lib/validations/image";

/**
 * Image storage, shared by players, staff, sponsors, teams and news posts.
 *
 * Objects live at {folder}/{ownerId}/{uuid}.{ext}. The random filename means
 * a replacement never collides with a cached copy of the old one, and the
 * per-owner folder makes cleanup on delete a single call.
 *
 * PostgreSQL stores the public URL (for rendering) and the object path (for
 * deleting) — never the image bytes.
 */

export type MediaFolder = "players" | "staff" | "sponsors" | "teams" | "news";

export interface StoredImage {
  url: string;
  path: string;
}

export async function uploadImage(
  folder: MediaFolder,
  ownerId: string,
  file: File,
): Promise<StoredImage> {
  const path = `${folder}/${ownerId}/${crypto.randomUUID()}.${extensionFor(file)}`;

  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    throw new Error(`Unable to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return { url: publicUrl, path };
}

/**
 * Best-effort delete. A failure here is logged but never fails the request:
 * an orphaned object is untidy, whereas a record that cannot be saved or
 * deleted because storage hiccuped is a broken CMS.
 */
export async function deleteImage(path: string | null | undefined): Promise<void> {
  if (!path) return;

  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.error(`[storage] could not delete ${path}:`, error.message);
}

/** Removes an owner's whole folder — used when the record is deleted. */
export async function deleteFolder(folder: MediaFolder, ownerId: string): Promise<void> {
  const prefix = `${folder}/${ownerId}`;
  const { data, error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).list(prefix);

  if (error) {
    console.error(`[storage] could not list ${prefix}:`, error.message);
    return;
  }
  if (!data?.length) return;

  const paths = data.map((entry) => `${prefix}/${entry.name}`);
  const { error: removeError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .remove(paths);

  if (removeError) {
    console.error(`[storage] could not remove ${paths.length} object(s):`, removeError.message);
  }
}
