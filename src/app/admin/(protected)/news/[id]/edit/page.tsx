import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsForm } from "@/components/admin/news-form";
import { getNewsPostById } from "@/features/news/queries";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditNewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsPostById(id);

  if (!post) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          News
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">{post.title}</h1>
        <p className="mt-2 text-muted-foreground">
          Uploading a new cover replaces the old one and deletes it from storage.
        </p>
      </header>

      <NewsForm post={post} />
    </div>
  );
}
