"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";
import { contactServerSchema } from "@/lib/validations/contact.schema";

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/**
 * The one Server Action in this app with no requireAdmin() call — a visitor
 * submits this while signed out, so it has no auth gate to rely on. Two
 * things stand in for that: a honeypot field real visitors never see or fill
 * (the form hides it off-screen with CSS, not display:none, and takes it out
 * of the tab order), checked before validation even runs; and re-validating
 * every field server-side even though the browser already checked, the same
 * rule every other action in the app follows.
 */
export async function createContactMessage(formData: FormData): Promise<ActionResult> {
  if (formData.get("website")) {
    // A filled honeypot means something filled in every field it could find.
    // Report success anyway — a bot gets no signal that anything happened.
    return { ok: true, message: "Thanks — we'll be in touch." };
  }

  const parsed = contactServerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    reason: formData.get("reason"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    revalidatePath("/admin/messages");
    return { ok: true, message: "Thanks — we'll be in touch." };
  } catch (error) {
    console.error("[contact] create failed:", error);
    return { ok: false, message: "Could not send your message. Please try again." };
  }
}

export async function markMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  await requireAdmin();

  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (error) {
    console.error("[contact] mark read failed:", error);
    return { ok: false, message: "Could not update the message." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return { ok: false, message: "Message not found." };

  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { ok: true, message: "Message deleted." };
  } catch (error) {
    console.error("[contact] delete failed:", error);
    return { ok: false, message: "Could not delete the message. Please try again." };
  }
}
