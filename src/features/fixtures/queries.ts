// TOMBSTONE — not imported anywhere; safe to delete this file
// (src/features/fixtures/queries.ts).
//
// getFixtures()/getFixtureById() read the legacy Fixture/GoalEvent models,
// which were dropped from prisma/schema.prisma in favour of Team/Match (see
// the schema comment there). The public Fixtures page and admin Matches
// screens now go through src/features/matches/queries.ts instead — this file
// was simply missed when that cleanup landed, and kept failing `tsc` because
// `prisma.fixture` no longer exists on the generated client.
//
// Reduced to an empty module rather than deleted, since this device bridge
// has no delete capability.
export {};
