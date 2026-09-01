import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Wrap } from "@/components/layout/wrap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getPublicNewsPostBySlug } from "@/features/news/queries";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicNewsPostBySlug(slug);
  if (!post) return { title: "News" };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    image: post.coverUrl ?? undefined,
  });
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicNewsPostBySlug(slug);

  if (!post) notFound();

  // Plain text body, paragraphs separated by a blank line — the same
  // approach the Staff/Sponsor copy uses elsewhere, no Markdown library.
  const paragraphs = post.body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 pt-14 pb-13 text-white">
        <div className="pfc-page-glow absolute inset-0" aria-hidden />
        <Wrap className="relative">
          <Link
            href="/news"
            className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-teal hover:underline"
          >
            ← News
          </Link>
          <Eyebrow onDark>{formatDate(post.publishedAt)}</Eyebrow>
          <h1 className="text-[clamp(30px,4.6vw,48px)] font-black uppercase tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="mt-3.5 max-w-[60ch] text-white/70">{post.excerpt}</p>
        </Wrap>
      </section>

      <section className="py-12 md:py-17">
        <Wrap>
          <div className="mx-auto max-w-[720px]">
            {post.coverUrl ? (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-card">
                <Image src={post.coverUrl} alt="" fill sizes="720px" className="object-cover" />
              </div>
            ) : null}

            <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90">
              {paragraphs.map((paragraph, index) => (
                // Index is stable — this text never reorders on the client.
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
