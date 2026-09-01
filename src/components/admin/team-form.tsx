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
import { createTeam, updateTeam } from "@/features/teams/actions";
import {
  ACCEPTED_TEAM_LOGO_TYPES,
  teamFormSchema,
  teamLogoSchema,
  type TeamFormValues,
} from "@/lib/validations/club-team.schema";
import type { Team } from "@/types";

/**
 * One form for create and edit, following the same shape as StaffForm and
 * SponsorForm: React Hook Form + Zod in the browser, the same schema again
 * in the Server Action, ImageField for the logo.
 */
export function TeamForm({ team }: { team?: Team }) {
  const router = useRouter();
  const [logo, setLogo] = useState<ImageFieldState>({ file: null, remove: false });
  const [logoError, setLogoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: team?.name ?? "",
      isPrimary: team?.isPrimary ?? false,
    },
  });

  const isPrimary = watch("isPrimary");

  async function onSubmit(values: TeamFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("isPrimary", values.isPrimary ? "true" : "false");
    if (logo.file) formData.set("logo", logo.file);
    if (logo.remove) formData.set("removeLogo", "true");

    const result = team ? await updateTeam(team.id, formData) : await createTeam(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === "logo") setLogoError(message);
          else setError(field as keyof TeamFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/teams");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ImageField
          label="Team logo"
          hint="JPG, PNG, WebP or SVG, up to 2 MB. A transparent PNG works best."
          schema={teamLogoSchema}
          accept={ACCEPTED_TEAM_LOGO_TYPES}
          existingUrl={team?.logoUrl ?? null}
          fallbackText={team?.name ?? "Team"}
          error={logoError}
          onErrorChange={setLogoError}
          onChange={setLogo}
          aspect="logo"
        />

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Team name</Label>
            <Input
              id="name"
              placeholder="Precision FC"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <label className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-teal-dark"
              checked={isPrimary}
              onChange={(event) => setValue("isPrimary", event.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium">This is our club team</span>
              <span className="block text-sm text-muted-foreground">
                Auto-selected as the home team when scheduling a match. Only one team can be
                primary — marking this one clears it elsewhere.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" variant="lime" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : team ? (
            "Save team"
          ) : (
            "Add team"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/teams">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
