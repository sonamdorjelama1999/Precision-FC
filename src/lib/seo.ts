import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Builds one page's full metadata explicitly rather than leaning on Next's
 * OpenGraph merge behaviour, which only shallow-merges nested objects — a
 * page that sets its own `openGraph` would otherwise silently drop the
 * site-wide defaults (siteName, image) that the root layout sets, and its
 * own title wouldn't carry the "— Precision FC" suffix the way the plain
 * <title> tag does via the template in app/layout.tsx.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. "/fixtures". */
  path: string;
  /** Defaults to the club crest — pass a news post's cover image instead. */
  image?: string;
}): Metadata {
  const fullTitle = `${title} — Precision FC`;
  const images = [{ url: image ?? "/crest.png" }];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Precision FC",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
