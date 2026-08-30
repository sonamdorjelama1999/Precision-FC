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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPlayer, updatePlayer } from "@/features/players/actions";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PHOTO_BYTES,
  photoSchema,
  playerFormSchema,
  type PlayerFormValues,
} from "@/lib/validations/player.schema";
import { PLAYER_POSITIONS, POSITION_LABEL, type Player } from "@/types";

/**
 * One form for create and edit.
 *
 * React Hook Form + Zod validate in the browser; the same playerSchema runs
 * again inside the server action, so a crafted request cannot bypass it.
 * Field errors returned by the server are pushed back onto the matching
 * inputs rather than shown only as a toast.
 *
 * The photo picker is the same ImageField the staff and sponsor forms use —
 * this form predates that extraction, which is why it used to carry its own
 * copy of the upload markup.
 */
export function PlayerForm({ player }: { player?: Player }) {
  const router = useRouter();
  const isEdit = Boolean(player);

  const [photo, setPhoto] = useState<ImageFieldState>({ file: null, remove: false });
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      playerNumber: player?.playerNumber ?? Number.NaN,
      name: player?.name ?? "",
      position: player?.position ?? "PIVOT",
      role: player?.role ?? "",
      isCaptain: player?.isCaptain ?? false,
    },
  });

  const position = watch("position");
  const name = watch("name");
  const isCaptain = watch("isCaptain");

  async function onSubmit(values: PlayerFormValues) {
    const formData = new FormData();
    formData.set("playerNumber", String(values.playerNumber));
    formData.set("name", values.name);
    formData.set("position", values.position);
    formData.set("role", values.role);
    formData.set("isCaptain", values.isCaptain ? "true" : "false");
    if (photo.file) formData.set("photo", photo.file);
    if (photo.remove) formData.set("removePhoto", "true");

    const result = player
      ? await updatePlayer(player.id, formData)
      : await createPlayer(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === "photo") setPhotoError(message);
          else setError(field as keyof PlayerFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/players");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ImageField
          label="Player photo"
          hint={`JPG, PNG or WebP, up to ${Math.round(MAX_PHOTO_BYTES / 1024 / 1024)} MB. Portrait crops look best.`}
          schema={photoSchema}
          accept={ACCEPTED_IMAGE_TYPES}
          existingUrl={player?.photoUrl ?? null}
          fallbackText={name || "Player"}
          error={photoError}
          onErrorChange={setPhotoError}
          onChange={setPhoto}
        />

        {/* fields */}
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="playerNumber">Shirt number</Label>
              <Input
                id="playerNumber"
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                placeholder="10"
                aria-invalid={!!errors.playerNumber}
                {...register("playerNumber", { valueAsNumber: true })}
              />
              {errors.playerNumber ? (
                <p className="text-sm text-destructive">{errors.playerNumber.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full name"
                autoComplete="off"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={position}
              onValueChange={(value) =>
                setValue("position", value as PlayerFormValues["position"], { shouldValidate: true })
              }
            >
              <SelectTrigger id="position" aria-invalid={!!errors.position}>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {PLAYER_POSITIONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {POSITION_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("position")} />
            {errors.position ? (
              <p className="text-sm text-destructive">{errors.position.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input id="role" placeholder="e.g. Club top scorer" {...register("role")} />
            {errors.role ? <p className="text-sm text-destructive">{errors.role.message}</p> : null}
          </div>

          <label className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-teal-dark"
              checked={isCaptain}
              onChange={(event) => setValue("isCaptain", event.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium">Captain</span>
              <span className="block text-sm text-muted-foreground">
                Only one player can hold this at a time — setting it here clears it elsewhere.
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
          ) : isEdit ? (
            "Save player"
          ) : (
            "Add player"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/players">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
