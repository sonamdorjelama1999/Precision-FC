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
import { createSponsor, updateSponsor } from "@/features/team/actions";
import {
  ACCEPTED_LOGO_TYPES,
  sponsorFormSchema,
  sponsorLogoSchema,
  type SponsorFormValues,
} from "@/lib/validations/team.schema";
import { SPONSOR_TIERS, SPONSOR_TIER_LABEL, type Sponsor } from "@/types";

export function SponsorForm({ sponsor }: { sponsor?: Sponsor }) {
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
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: sponsor?.name ?? "",
      tier: sponsor?.tier ?? "PARTNER",
      websiteUrl: sponsor?.websiteUrl ?? "",
      displayOrder: sponsor?.displayOrder ?? 0,
    },
  });

  const tier = watch("tier");

  async function onSubmit(values: SponsorFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("tier", values.tier);
    formData.set("websiteUrl", values.websiteUrl);
    formData.set("displayOrder", String(values.displayOrder));
    if (logo.file) formData.set("logo", logo.file);
    if (logo.remove) formData.set("removeLogo", "true");

    const result = sponsor
      ? await updateSponsor(sponsor.id, formData)
      : await createSponsor(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === "logo") setLogoError(message);
          else setError(field as keyof SponsorFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/sponsors");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <ImageField
          label="Logo"
          hint="JPG, PNG, WebP or SVG, up to 2 MB. A transparent PNG works best — it is tinted white on dark bands."
          schema={sponsorLogoSchema}
          accept={ACCEPTED_LOGO_TYPES}
          existingUrl={sponsor?.logoUrl ?? null}
          fallbackText={sponsor?.name ?? ""}
          error={logoError}
          onErrorChange={setLogoError}
          onChange={setLogo}
          aspect="logo"
        />

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Sponsor name</Label>
            <Input id="name" placeholder="Company name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Tier</Label>
            <Select
              value={tier}
              onValueChange={(value) =>
                setValue("tier", value as SponsorFormValues["tier"], { shouldValidate: true })
              }
            >
              <SelectTrigger id="tier" aria-invalid={!!errors.tier}>
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent>
                {SPONSOR_TIERS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {SPONSOR_TIER_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("tier")} />
            <p className="text-xs text-muted-foreground">
              Principal partners render larger than the rest.
            </p>
            {errors.tier ? <p className="text-sm text-destructive">{errors.tier.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">
              Website <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="websiteUrl"
              placeholder="acme.com"
              inputMode="url"
              aria-invalid={!!errors.websiteUrl}
              {...register("websiteUrl")}
            />
            <p className="text-xs text-muted-foreground">
              https:// is added automatically if you leave it out.
            </p>
            {errors.websiteUrl ? (
              <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
            ) : null}
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
          ) : sponsor ? (
            "Save sponsor"
          ) : (
            "Add sponsor"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/sponsors">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
