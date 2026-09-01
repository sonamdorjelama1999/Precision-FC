import "server-only";

import { deleteFolder, deleteImage, uploadImage } from "@/features/media/storage";

/**
 * News cover images. Mechanics live in features/media/storage.ts, shared
 * with players, staff, sponsors and teams; these wrappers just fix the
 * folder and keep the field names the news actions expect.
 */

export interface StoredCover {
  coverUrl: string;
  coverPath: string;
}

export async function uploadNewsCover(postId: string, file: File): Promise<StoredCover> {
  const stored = await uploadImage("news", postId, file);
  return { coverUrl: stored.url, coverPath: stored.path };
}

export async function deleteNewsCover(path: string | null | undefined): Promise<void> {
  return deleteImage(path);
}

export async function deleteNewsFolder(postId: string): Promise<void> {
  return deleteFolder("news", postId);
}
