import type { Metadata } from "next";

import { NewsForm } from "@/components/admin/news-form";

export const metadata: Metadata = { title: "New post" };

export default function NewNewsPostPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
          News
        </p>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">New post</h1>
        <p className="mt-2 text-muted-foreground">
          Published posts with a publish date in the past appear on the public News page right away.
        </p>
      </header>

      <NewsForm />
    </div>
  );
}
