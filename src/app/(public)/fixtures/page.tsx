import { notFound } from "next/navigation";

/**
 * TOMBSTONE — safe to delete this whole folder.
 *
 * The fixtures section was removed from the site. In Next.js any page.tsx
 * creates a route, so while this file exists /fixtures would still resolve;
 * calling notFound() makes it 404 like every other unknown path.
 *
 * Deleting src/app/(public)/fixtures/ is the real fix — this only guarantees
 * the behaviour until then.
 */
export default function RemovedFixturesPage() {
  notFound();
}
