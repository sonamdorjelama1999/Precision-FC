import "server-only";

import { deleteFolder, deleteImage, uploadImage } from "@/features/media/storage";

/**
 * Player photos. The mechanics live in features/media/storage.ts, shared with
 * staff and sponsors; these wrappers just fix the folder and keep the field
 * names the player actions expect.
 */

export interface StoredPhoto {
  photoUrl: string;
  photoPath: string;
}

export async function uploadPlayerPhoto(playerId: string, file: File): Promise<StoredPhoto> {
  const stored = await uploadImage("players", playerId, file);
  return { photoUrl: stored.url, photoPath: stored.path };
}

export async function deletePlayerPhoto(path: string | null | undefined): Promise<void> {
  return deleteImage(path);
}

export async function deletePlayerFolder(playerId: string): Promise<void> {
  return deleteFolder("players", playerId);
}
