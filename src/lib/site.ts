/**
 * The canonical origin for anything that needs an absolute URL: the sitemap,
 * robots.txt, and OpenGraph/Twitter card tags. Falls back to a placeholder
 * so the build never fails over a missing env var — set NEXT_PUBLIC_SITE_URL
 * once the club has a real domain, and every consumer of this picks it up
 * automatically.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://precisionfc.club";
