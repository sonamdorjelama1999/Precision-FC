"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { deleteNewsCover, deleteNewsFolder, uploadNewsCover } from "@/features/news/storage";
import { prisma } from "@/lib/prisma";
import { coverSchema, newsServerSchema } from "@/lib/validations/news.schema";

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
  revalidatePath("/news");
  revalidatePath("/admin/news");
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function parseNewsForm(formData: FormData) {
  return newsServerSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    publishedAt: formData.get("publishedAt"),
    isPublished: formData.get("isPublished") === "on" || formData.get("isPublished") === "true",
  });
}

/** Returns a validated File, or null when no new cover was submitted. */
function parseCover(formData: FormData) {
  const raw = formData.get("cover");
  if (!(raw instanceof File) || raw.size === 0) return { file: null as File | null };

  const parsed = coverSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid image." };
  }
  return { file: parsed.data };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function duplicateSlugResult(slug: string): ActionResult {
  const message = `The URL "/news/${slug}" is already taken by another post.`;
  return { ok: false, message, fieldErrors: { slug: message } };
}

// ---------------------------------------------------------------------------

export async function createNewsPost(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const cover = parseCover(formData);
  if ("error" in cover && cover.error) {
    return { ok: false, message: cover.error, fieldErrors: { cover: cover.error } };
  }

  let createdId: string | null = null;

  try {
    const post = await prisma.newsPost.create({ data: parsed.data });
    createdId = post.id;

    if (cover.file) {
      const stored = await uploadNewsCover(post.id, cover.file);
      await prisma.newsPost.update({ where: { id: post.id }, data: stored });
    }

    revalidateEverything();
    revalidatePath(`/news/${parsed.data.slug}`);
    return { ok: true, message: `"${parsed.data.title}" published.` };
  } catch (error) {
    if (createdId) {
      await prisma.newsPost.delete({ where: { id: createdId } }).catch(() => {});
    }
    if (isUniqueViolation(error)) return duplicateSlugResult(parsed.data.slug);

    console.error("[news] create failed:", error);
    return { ok: false, message: "Could not create the post. Please try again." };
  }
}

export async function updateNewsPost(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Post not found." };

  const parsed = parseNewsForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const cover = parseCover(formData);
  if ("error" in cover && cover.error) {
    return { ok: false, message: cover.error, fieldErrors: { cover: cover.error } };
  }

  try {
    let coverFields: { coverUrl?: string | null; coverPath?: string | null } = {};

    if (cover.file) {
      coverFields = await uploadNewsCover(id, cover.file);
    } else if (formData.get("removeCover") === "true") {
      coverFields = { coverUrl: null, coverPath: null };
    }

    await prisma.newsPost.update({
      where: { id },
      data: { ...parsed.data, ...coverFields },
    });

    // The old object is only removed once the new row is safely written.
    if ("coverPath" in coverFields && existing.coverPath) {
      await deleteNewsCover(existing.coverPath);
    }

    revalidateEverything();
    revalidatePath(`/admin/news/${id}/edit`);
    revalidatePath(`/news/${existing.slug}`);
    if (existing.slug !== parsed.data.slug) revalidatePath(`/news/${parsed.data.slug}`);
    return { ok: true, message: `"${parsed.data.title}" updated.` };
  } catch (error) {
    if (isUniqueViolation(error)) return duplicateSlugResult(parsed.data.slug);

    console.error("[news] update failed:", error);
    return { ok: false, message: "Could not save the post. Please try again." };
  }
}

export async function deleteNewsPost(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Post not found." };

  try {
    await prisma.newsPost.delete({ where: { id } });
    await deleteNewsFolder(id);

    revalidateEverything();
    revalidatePath(`/news/${existing.slug}`);
    return { ok: true, message: `"${existing.title}" removed.` };
  } catch (error) {
    console.error("[news] delete failed:", error);
    return { ok: false, message: "Could not delete the post. Please try again." };
  }
}
