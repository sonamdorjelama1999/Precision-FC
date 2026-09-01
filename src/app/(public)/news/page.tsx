import Image from "next/image";
import Link from "next/link";

import { PageHead } from "@/components/layout/page-head";
import { Wrap } from "@/components/layout/wrap";
import { getPublicNewsPosts } from "@/features/news/queries";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

/**
 * Statically rendered and re-generated on demand, same pattern as the
 * fixtures and squad pages — the admin news actions call
 * revalidatePath("/news") after every save, and this interval is the safety
 * net in case a revalidation is ever missed.
 */
export const revalidate = 300;

export const metadata = pageMetadata({
  title: "News",
  description: "The latest updates, match reports and announcements from Precision FC.",
  path: "/news",
});

export default async function NewsPage() {
  const posts = await getPublicNewsPosts();

  return (
    <>
      <PageHead
        eyebrow="Club news"
        title="News"
        description="Match reports, announcements and everything else happening at the club."
      />

      <section className="py-12 md:py-17">
        <Wrap>
          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No news posted yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-card border border-border bg-card transition-colors hover:border-teal-dark/40"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-navy-900">
                    {post.coverUrl ? (
                      <Image
                        src={post.coverUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="pfc-page-glow absolute inset-0" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal-dark">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h2 className="font-display text-lg font-bold uppercase tracking-[-0.01em] group-hover:underline">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Wrap>
      </section>
    </>
  );
}
