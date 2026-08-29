"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { deleteFolder, deleteImage, uploadImage } from "@/features/media/storage";
import { prisma } from "@/lib/prisma";
import {
  sponsorLogoSchema,
  sponsorServerSchema,
  staffPhotoSchema,
  staffServerSchema,
} from "@/lib/validations/team.schema";

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Same rules as the player actions: requireAdmin() first, because Server
 * Actions are public endpoints; ids are looked up rather than trusted; and
 * validation runs again here even though the browser already checked.
 */

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/squad");
  revalidatePath("/about");
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Returns a validated File, or null when no new image was submitted. */
function parseImage(
  formData: FormData,
  field: string,
  schema: typeof staffPhotoSchema | typeof sponsorLogoSchema,
) {
  const raw = formData.get(field);
  if (!(raw instanceof File) || raw.size === 0) return { file: null as File | null };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid image." };
  }
  return { file: parsed.data };
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export async function createStaffMember(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = staffServerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    displayOrder: formData.get("displayOrder"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const photo = parseImage(formData, "photo", staffPhotoSchema);
  if ("error" in photo && photo.error) {
    return { ok: false, message: photo.error, fieldErrors: { photo: photo.error } };
  }

  let createdId: string | null = null;

  try {
    const member = await prisma.staffMember.create({ data: parsed.data });
    createdId = member.id;

    if (photo.file) {
      const stored = await uploadImage("staff", member.id, photo.file);
      await prisma.staffMember.update({
        where: { id: member.id },
        data: { photoUrl: stored.url, photoPath: stored.path },
      });
    }

    revalidatePublic();
    revalidatePath("/admin/staff");
    return { ok: true, message: `${parsed.data.name} added.` };
  } catch (error) {
    if (createdId) {
      await prisma.staffMember.delete({ where: { id: createdId } }).catch(() => {});
    }
    console.error("[staff] create failed:", error);
    return { ok: false, message: "Could not add the staff member. Please try again." };
  }
}

export async function updateStaffMember(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.staffMember.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Staff member not found." };

  const parsed = staffServerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    displayOrder: formData.get("displayOrder"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const photo = parseImage(formData, "photo", staffPhotoSchema);
  if ("error" in photo && photo.error) {
    return { ok: false, message: photo.error, fieldErrors: { photo: photo.error } };
  }

  try {
    let imageFields: { photoUrl?: string | null; photoPath?: string | null } = {};

    if (photo.file) {
      const stored = await uploadImage("staff", id, photo.file);
      imageFields = { photoUrl: stored.url, photoPath: stored.path };
    } else if (formData.get("removePhoto") === "true") {
      imageFields = { photoUrl: null, photoPath: null };
    }

    await prisma.staffMember.update({
      where: { id },
      data: { ...parsed.data, ...imageFields },
    });

    // Old object removed only once the new row is safely written.
    if ("photoPath" in imageFields && existing.photoPath) {
      await deleteImage(existing.photoPath);
    }

    revalidatePublic();
    revalidatePath("/admin/staff");
    return { ok: true, message: `${parsed.data.name} updated.` };
  } catch (error) {
    console.error("[staff] update failed:", error);
    return { ok: false, message: "Could not save the staff member. Please try again." };
  }
}

export async function deleteStaffMember(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.staffMember.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Staff member not found." };

  try {
    await prisma.staffMember.delete({ where: { id } });
    await deleteFolder("staff", id);

    revalidatePublic();
    revalidatePath("/admin/staff");
    return { ok: true, message: `${existing.name} removed.` };
  } catch (error) {
    console.error("[staff] delete failed:", error);
    return { ok: false, message: "Could not delete the staff member. Please try again." };
  }
}

// ---------------------------------------------------------------------------
// Sponsors
// ---------------------------------------------------------------------------

function parseSponsor(formData: FormData) {
  return sponsorServerSchema.safeParse({
    name: formData.get("name"),
    tier: formData.get("tier"),
    websiteUrl: formData.get("websiteUrl") ?? "",
    displayOrder: formData.get("displayOrder"),
  });
}

export async function createSponsor(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseSponsor(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const logo = parseImage(formData, "logo", sponsorLogoSchema);
  if ("error" in logo && logo.error) {
    return { ok: false, message: logo.error, fieldErrors: { logo: logo.error } };
  }

  let createdId: string | null = null;

  try {
    const sponsor = await prisma.sponsor.create({ data: parsed.data });
    createdId = sponsor.id;

    if (logo.file) {
      const stored = await uploadImage("sponsors", sponsor.id, logo.file);
      await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: { logoUrl: stored.url, logoPath: stored.path },
      });
    }

    revalidatePublic();
    revalidatePath("/admin/sponsors");
    return { ok: true, message: `${parsed.data.name} added.` };
  } catch (error) {
    if (createdId) {
      await prisma.sponsor.delete({ where: { id: createdId } }).catch(() => {});
    }
    console.error("[sponsors] create failed:", error);
    return { ok: false, message: "Could not add the sponsor. Please try again." };
  }
}

export async function updateSponsor(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.sponsor.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Sponsor not found." };

  const parsed = parseSponsor(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const logo = parseImage(formData, "logo", sponsorLogoSchema);
  if ("error" in logo && logo.error) {
    return { ok: false, message: logo.error, fieldErrors: { logo: logo.error } };
  }

  try {
    let imageFields: { logoUrl?: string | null; logoPath?: string | null } = {};

    if (logo.file) {
      const stored = await uploadImage("sponsors", id, logo.file);
      imageFields = { logoUrl: stored.url, logoPath: stored.path };
    } else if (formData.get("removeLogo") === "true") {
      imageFields = { logoUrl: null, logoPath: null };
    }

    await prisma.sponsor.update({
      where: { id },
      data: { ...parsed.data, ...imageFields },
    });

    if ("logoPath" in imageFields && existing.logoPath) {
      await deleteImage(existing.logoPath);
    }

    revalidatePublic();
    revalidatePath("/admin/sponsors");
    return { ok: true, message: `${parsed.data.name} updated.` };
  } catch (error) {
    console.error("[sponsors] update failed:", error);
    return { ok: false, message: "Could not save the sponsor. Please try again." };
  }
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.sponsor.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Sponsor not found." };

  try {
    await prisma.sponsor.delete({ where: { id } });
    await deleteFolder("sponsors", id);

    revalidatePublic();
    revalidatePath("/admin/sponsors");
    return { ok: true, message: `${existing.name} removed.` };
  } catch (error) {
    console.error("[sponsors] delete failed:", error);
    return { ok: false, message: "Could not delete the sponsor. Please try again." };
  }
}
