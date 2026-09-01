import type { MetadataRoute } from "next";

import { getPublicNewsPosts } from "@/features/news/queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublicNewsPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/squad`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/fixtures`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/news`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
