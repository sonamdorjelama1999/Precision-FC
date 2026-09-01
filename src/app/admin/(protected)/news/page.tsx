import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { NewsTable } from "@/components/admin/news-table";
import { Button } from "@/components/ui/button";
import { getNewsPosts } from "@/features/news/queries";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage() {
  const posts = await getNewsPosts();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">News</h1>
          <p className="mt-2 text-muted-foreground">
            {posts.length} post{posts.length === 1 ? "" : "s"}, published and draft.
          </p>
        </div>
        <Button asChild variant="lime">
          <Link href="/admin/news/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </header>

      <NewsTable posts={posts} />
    </div>
  );
}
