import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed script — bootstraps the one thing the app cannot create for itself:
 * the first admin account.
 *
 * Everything else (teams, players, matches, staff, sponsors) is managed
 * entirely through the CMS now, so none of it belongs in a seed script — a
 * script that fabricates football data would drift from whatever is
 * actually true on the site the moment someone edits it there. (An earlier
 * version of this file seeded a placeholder player and five fake fixtures
 * against the legacy Fixture/GoalEvent model; both are gone now that the
 * real Team/Match model covers this, and re-adding them here would just be
 * fake data with nowhere to feed a real page.)
 *
 *   npx prisma db seed
 *
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local and are
 * never written into source. Idempotent: safe to re-run any time — it
 * upserts the admin's password rather than erroring if the account already
 * exists.
 */

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL (or DATABASE_URL) must be set to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local before seeding.");
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD should be at least 10 characters.");
  }

  const hashed = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashed },
    create: { email, password: hashed, role: "ADMIN" },
  });

  console.log(`✓ admin ready: ${admin.email}`);
}

seedAdmin()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
