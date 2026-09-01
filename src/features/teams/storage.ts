import "server-only";

import { deleteFolder, deleteImage, uploadImage } from "@/features/media/storage";

/**
 * Team logos. Mechanics live in features/media/storage.ts, shared with
 * players, staff and sponsors; these wrappers just fix the folder and keep
 * the field names the team actions expect.
 */

export interface StoredLogo {
  logoUrl: string;
  logoPath: string;
}

export async function uploadTeamLogo(teamId: string, file: File): Promise<StoredLogo> {
  const stored = await uploadImage("teams", teamId, file);
  return { logoUrl: stored.url, logoPath: stored.path };
}

export async function deleteTeamLogo(path: string | null | undefined): Promise<void> {
  return deleteImage(path);
}

export async function deleteTeamFolder(teamId: string): Promise<void> {
  return deleteFolder("teams", teamId);
}
