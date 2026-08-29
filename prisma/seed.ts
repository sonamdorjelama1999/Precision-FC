import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed script.
 *
 * Idempotent by design — every write is an upsert keyed on something stable
 * (admin email, shirt number, fixture date + opponent), so running it twice
 * updates rather than duplicates. Safe to re-run after a schema change.
 *
 *   npx prisma db seed
 *
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local and are
 * never written into source.
 */

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL (or DATABASE_URL) must be set to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// ---------------------------------------------------------------------------
// The content carried over from the static site.
// Scores and dates are the placeholders that were on the old site — replace
// them from the CMS once real results are in.
// ---------------------------------------------------------------------------

const PLAYERS = [
  {
    playerNumber: 10,
    name: "Asok Sunuwar",
    position: "PIVOT",
    role: "Club top scorer",
    isCaptain: false,
  },
] as const;

type SeedGoal = {
  team: "PFC" | "OPPONENT";
  minute: number;
  scorerName?: string;
  assistName?: string;
};

const FIXTURES: Array<{
  date: string;
  opponent: string;
  isHome: boolean;
  status: "PLAYED" | "UPCOMING";
  competition: string;
  kickoff?: string;
  note?: string;
  events: SeedGoal[];
}> = [
  {
    date: "2026-05-16",
    opponent: "Gokarneswor FC",
    isHome: true,
    status: "PLAYED",
    competition: "Friendly",
    events: [
      { team: "PFC", minute: 6, scorerName: "Asok Sunuwar" },
      { team: "OPPONENT", minute: 14 },
      { team: "PFC", minute: 22, scorerName: "Asok Sunuwar" },
      { team: "PFC", minute: 31 },
    ],
  },
  {
    date: "2026-06-13",
    opponent: "Ama Yangri FC",
    isHome: true,
    status: "PLAYED",
    competition: "El Clasico",
    note: "The rivalry fixture. Fourth meeting between the two clubs.",
    events: [
      { team: "OPPONENT", minute: 9, scorerName: "Dorze Hyolmo" },
      { team: "PFC", minute: 18, scorerName: "Asok Sunuwar" },
      { team: "OPPONENT", minute: 27, scorerName: "Dorze Hyolmo" },
      { team: "PFC", minute: 35 },
    ],
  },
  {
    date: "2026-07-11",
    opponent: "Thanka FC",
    isHome: false,
    status: "PLAYED",
    competition: "Friendly",
    events: [
      { team: "OPPONENT", minute: 12 },
      { team: "OPPONENT", minute: 29 },
    ],
  },
  {
    date: "2026-08-08",
    opponent: "Ama Yangri FC",
    isHome: false,
    status: "PLAYED",
    competition: "El Clasico",
    events: [
      { team: "PFC", minute: 4, scorerName: "Asok Sunuwar" },
      { team: "PFC", minute: 20, scorerName: "Asok Sunuwar" },
      { team: "OPPONENT", minute: 33, scorerName: "Dorze Hyolmo" },
    ],
  },
  {
    date: "2026-09-12",
    opponent: "Ama Yangri FC",
    isHome: true,
    status: "UPCOMING",
    competition: "El Clasico",
    kickoff: "18:00",
    events: [],
  },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local before seeding.",
    );
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

async function seedPlayers() {
  for (const player of PLAYERS) {
    await prisma.player.upsert({
      where: { playerNumber: player.playerNumber },
      update: {
        name: player.name,
        position: player.position,
        role: player.role,
        isCaptain: player.isCaptain,
      },
      create: {
        playerNumber: player.playerNumber,
        name: player.name,
        position: player.position,
        role: player.role,
        isCaptain: player.isCaptain,
      },
    });
  }
  console.log(`✓ ${PLAYERS.length} player(s) seeded`);
}

async function seedFixtures() {
  // Link goals to squad members by name where one exists, so the scorer
  // table survives a later rename.
  const players = await prisma.player.findMany();
  const playerByName = new Map(players.map((p) => [p.name.toLowerCase(), p.id]));

  for (const fixture of FIXTURES) {
    const date = new Date(`${fixture.date}T00:00:00.000Z`);

    const existing = await prisma.fixture.findFirst({
      where: { date, opponent: fixture.opponent },
      select: { id: true },
    });

    const data = {
      date,
      opponent: fixture.opponent,
      isHome: fixture.isHome,
      status: fixture.status,
      competition: fixture.competition,
      kickoff: fixture.kickoff ?? null,
      note: fixture.note ?? null,
    };

    const record = existing
      ? await prisma.fixture.update({ where: { id: existing.id }, data })
      : await prisma.fixture.create({ data });

    // Goals are replaced wholesale — the fixture's own log is the unit here,
    // and re-seeding should not stack duplicate goals on top of old ones.
    await prisma.goalEvent.deleteMany({ where: { fixtureId: record.id } });

    if (fixture.events.length > 0) {
      await prisma.goalEvent.createMany({
        data: fixture.events.map((event) => ({
          fixtureId: record.id,
          team: event.team,
          minute: event.minute,
          scorerName: event.scorerName ?? null,
          assistName: event.assistName ?? null,
          playerId:
            event.team === "PFC" && event.scorerName
              ? (playerByName.get(event.scorerName.toLowerCase()) ?? null)
              : null,
        })),
      });
    }
  }

  console.log(`✓ ${FIXTURES.length} fixtures seeded`);
}

async function main() {
  await seedAdmin();
  await seedPlayers();
  await seedFixtures();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
