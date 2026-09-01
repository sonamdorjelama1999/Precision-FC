"use client";

import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The upload control shared by the player, staff, sponsor, team and news
 * forms.
 *
 * Validates the file in the browser before it is ever sent, shows a preview
 * from an object URL, and hands the parent the File plus a "remove existing"
 * flag. The parent owns the FormData; this only owns the picking.
 */
export interface ImageFieldState {
  file: File | null;
  remove: boolean;
}

export function ImageField({
  label,
  hint,
  schema,
  accept,
  existingUrl,
  fallbackText,
  error,
  onErrorChange,
  onChange,
  aspect = "portrait",
  emptyLabel = "No logo",
}: {
  label: string;
  hint: string;
  schema: z.ZodType<File>;
  accept: readonly string[];
  existingUrl: string | null;
  fallbackText: string;
  error: string | null;
  onErrorChange: (message: string | null) => void;
  onChange: (state: ImageFieldState) => void;
  aspect?: "portrait" | "logo";
  /** Placeholder text shown when aspect="logo" and nothing has been uploaded yet. */
  emptyLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl);
  const isEditing = existingUrl !== null;

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const parsed = schema.safeParse(file);
    if (!parsed.success) {
      onErrorChange(parsed.error.issues[0]?.message ?? "Invalid image.");
      onChange({ file: null, remove: false });
      event.target.value = "";
      return;
    }

    onErrorChange(null);
    setPreview(URL.createObjectURL(file));
    onChange({ file, remove: false });
  }

  function clear() {
    onErrorChange(null);
    setPreview(null);
    onChange({ file: null, remove: isEditing });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div
        className={cn(
          "relative grid place-items-center overflow-hidden",
          aspect === "portrait"
            ? "pfc-player-ground aspect-3/4 rounded-card"
            : "aspect-[3/2] rounded-lg border border-border bg-card p-4",
        )}
      >
        {preview ? (
          // A plain img: next/image cannot optimise a blob: preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className={cn(
              aspect === "portrait"
                ? "absolute inset-0 size-full object-cover object-top"
                : "max-h-full max-w-full object-contain",
            )}
          />
        ) : (
          <span
            className={cn(
              "font-display font-black",
              aspect === "portrait" ? "text-6xl text-white/15" : "text-2xl text-muted-foreground",
            )}
          >
            {aspect === "portrait" ? initials(fallbackText || "?") || "?" : emptyLabel}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {preview ? "Replace" : "Upload"}
        </Button>
        {preview ? (
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            <X className="size-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="hidden"
        onChange={pick}
      />

      <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
        {error ?? hint}
      </p>
    </div>
  );
}
