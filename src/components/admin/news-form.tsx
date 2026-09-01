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
import { createNewsPost, updateNewsPost } from "@/features/news/actions";
import { toDateInputValue } from "@/lib/format";
import { slugify } from "@/lib/utils";
import {
  ACCEPTED_COVER_TYPES,
  MAX_COVER_BYTES,
  coverSchema,
  newsFormSchema,
  type NewsFormValues,
} from "@/lib/validations/news.schema";
import type { NewsPost } from "@/types";

/**
 * One form for create and edit, following the same shape as TeamForm and
 * PlayerForm. The one addition specific to this entity is the slug: it
 * auto-fills from the title with slugify() until the admin edits it by hand,
 * at which point it stops following the title — the same "autofill until
 * touched" pattern a lot of CMSs use for this exact field.
 */
export function NewsForm({ post }: { post?: NewsPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [cover, setCover] = useState<ImageFieldState>({ file: null, remove: false });
  const [coverError, setCoverError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      publishedAt: toDateInputValue(post?.publishedAt ?? new Date()),
      isPublished: post?.isPublished ?? true,
    },
  });

  const title = watch("title");
  const isPublished = watch("isPublished");

  async function onSubmit(values: NewsFormValues) {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("slug", values.slug);
    formData.set("excerpt", values.excerpt);
    formData.set("body", values.body);
    formData.set("publishedAt", values.publishedAt);
    formData.set("isPublished", values.isPublished ? "true" : "false");
    if (cover.file) formData.set("cover", cover.file);
    if (cover.remove) formData.set("removeCover", "true");

    const result = post ? await updateNewsPost(post.id, formData) : await createNewsPost(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (field === "cover") setCoverError(message);
          else setError(field as keyof NewsFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ImageField
          label="Cover image"
          hint={`JPG, PNG or WebP, up to ${Math.round(MAX_COVER_BYTES / 1024 / 1024)} MB. Landscape works best.`}
          schema={coverSchema}
          accept={ACCEPTED_COVER_TYPES}
          existingUrl={post?.coverUrl ?? null}
          fallbackText={title || "Post"}
          error={coverError}
          onErrorChange={setCoverError}
          onChange={setCover}
          aspect="logo"
          emptyLabel="No cover"
        />

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Match report: Precision FC 3-1 Yangrima FC"
              aria-invalid={!!errors.title}
              {...register("title", {
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!slugTouched) setValue("slug", slugify(event.target.value));
                },
              })}
            />
            {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-mono text-xs text-muted-foreground">/news/</span>
              <Input
                id="slug"
                placeholder="match-report-vs-yangrima"
                aria-invalid={!!errors.slug}
                {...register("slug", { onChange: () => setSlugTouched(true) })}
              />
            </div>
            {errors.slug ? <p className="text-sm text-destructive">{errors.slug.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              placeholder="One or two sentences shown on the News list"
              aria-invalid={!!errors.excerpt}
              {...register("excerpt")}
            />
            {errors.excerpt ? (
              <p className="text-sm text-destructive">{errors.excerpt.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">Published date</Label>
            <Input
              id="publishedAt"
              type="date"
              className="max-w-[180px]"
              aria-invalid={!!errors.publishedAt}
              {...register("publishedAt")}
            />
            {errors.publishedAt ? (
              <p className="text-sm text-destructive">{errors.publishedAt.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <textarea
          id="body"
          rows={10}
          placeholder="Write the post. Leave a blank line between paragraphs."
          className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:border-destructive"
          aria-invalid={!!errors.body}
          {...register("body")}
        />
        {errors.body ? <p className="text-sm text-destructive">{errors.body.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-teal-dark"
          checked={isPublished}
          onChange={(event) => setValue("isPublished", event.target.checked)}
        />
        <span>
          <span className="block text-sm font-medium">Published</span>
          <span className="block text-sm text-muted-foreground">
            Shown on the public News page. Uncheck to keep this as a draft.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" variant="lime" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : isEdit ? (
            "Save post"
          ) : (
            "Publish post"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/news">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
