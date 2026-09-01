import "server-only";

import { prisma } from "@/lib/prisma";
import type { NewsPost } from "@/types";

/**
 * The single door to NewsPost data. Admin screens see every post regardless
 * of status; public pages only ever see published ones with a publish date
 * that has already arrived (a post scheduled for tomorrow isn't live yet).
 */

export async function getNewsPosts(): Promise<NewsPost[]> {
  return prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getNewsPostById(id: string): Promise<NewsPost | null> {
  return prisma.newsPost.findUnique({ where: { id } });
}

function publishedWhere() {
  return { isPublished: true, publishedAt: { lte: new Date() } } as const;
}

export async function getPublicNewsPosts(): Promise<NewsPost[]> {
  return prisma.newsPost.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublicNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  return prisma.newsPost.findFirst({ where: { slug, ...publishedWhere() } });
}

/** The N most recent published posts — the home page's "Latest news" teaser. */
export async function getLatestPublicNews(count: number): Promise<NewsPost[]> {
  return prisma.newsPost.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: "desc" },
    take: count,
  });
}
