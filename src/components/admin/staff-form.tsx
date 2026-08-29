"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ImageField, type ImageFieldState } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaffMember, updateStaffMember } from "@/features/team/actions";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/validations/image";
import {
  staffFormSchema,
  staffPhotoSchema,
  type StaffFormValues,
} from "@/lib/validations/team.schema";
import type { StaffMember } from "@/types";

const ROLE_SUGGESTIONS = ["Manager", "Head Coach", "Assistant Coach", "Goalkeeping Coach"];

export function StaffForm({ member }: { member?: StaffMember }) {
  const router = useRouter();
  const [photo, setPhoto] = useState<ImageFieldState>({ file: null, remove: false });
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: member?.name ?? "",
      role: member?.role ?? "Manager",
      displayOrder: member?.displayOrder ?? 0,
    },
  });

  async function onSubmit(values: StaffFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("role", values.role);
    formData.set("displayOrder", String(values.displayOrder));
    if (photo.file) formData.set("photo", photo.file);
    if (photo.remove) formData.set("removePhoto", "true");

    const result = member
      ? await updateStaffMember(member.id, formData)
      : await createStaffMember(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === "photo") setPhotoError(message);
          else setError(field as keyof StaffFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/staff");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ImageField
          label="Photo"
          hint="JPG, PNG or WebP, up to 2 MB. Portrait crops look best."
          schema={staffPhotoSchema}
          accept={ACCEPTED_IMAGE_TYPES}
          existingUrl={member?.photoUrl ?? null}
          fallbackText={member?.name ?? "Staff"}
          error={photoError}
          onErrorChange={setPhotoError}
          onChange={setPhoto}
        />

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Full name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              list="staff-roles"
              placeholder="Manager"
              aria-invalid={!!errors.role}
              {...register("role")}
            />
            <datalist id="staff-roles">
              {ROLE_SUGGESTIONS.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
            {errors.role ? <p className="text-sm text-destructive">{errors.role.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              type="number"
              min={0}
              max={999}
              className="max-w-32"
              aria-invalid={!!errors.displayOrder}
              {...register("displayOrder", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first on the squad page. The manager is usually 0.
            </p>
            {errors.displayOrder ? (
              <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" variant="lime" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : member ? (
            "Save"
          ) : (
            "Add to staff"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/staff">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
