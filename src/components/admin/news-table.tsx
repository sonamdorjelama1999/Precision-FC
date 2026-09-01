"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteNewsPost } from "@/features/news/actions";
import { formatShortDate } from "@/lib/format";
import type { NewsPost } from "@/types";

export function NewsTable({ posts }: { posts: NewsPost[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteNewsPost);

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        body="Publish the first update and it appears on the public News page straight away."
        href="/admin/news/new"
        cta="New post"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Published</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="relative grid size-11 place-items-center overflow-hidden rounded-md border border-border bg-background">
                    {post.coverUrl ? (
                      <Image
                        src={post.coverUrl}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-display text-[9px] font-black uppercase text-muted-foreground">
                        No cover
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{post.title}</span>
                  <span className="block text-xs text-muted-foreground">{post.excerpt}</span>
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  /news/{post.slug}
                </TableCell>
                <TableCell>
                  {post.isPublished ? (
                    <Badge variant="lime">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {formatShortDate(post.publishedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${post.title}`}>
                      <Link href={`/admin/news/${post.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${post.title}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setTarget({ id: post.id, name: post.title })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="post"
        hasImage
      />
    </>
  );
}
