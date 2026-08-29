-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'WINGER', 'FORWARD', 'PIVOT');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PLAYED', 'UPCOMING');

-- CreateEnum
CREATE TYPE "GoalTeam" AS ENUM ('PFC', 'OPPONENT');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "playerNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" "PlayerPosition" NOT NULL,
    "photoUrl" TEXT,
    "photoPath" TEXT,
    "role" TEXT,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixtures" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "opponent" TEXT NOT NULL,
    "isHome" BOOLEAN NOT NULL DEFAULT true,
    "status" "MatchStatus" NOT NULL DEFAULT 'UPCOMING',
    "competition" TEXT NOT NULL DEFAULT 'Friendly',
    "kickoff" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_events" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "team" "GoalTeam" NOT NULL,
    "minute" INTEGER,
    "playerId" TEXT,
    "scorerName" TEXT,
    "assistName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "players_playerNumber_key" ON "players"("playerNumber");

-- CreateIndex
CREATE INDEX "players_playerNumber_idx" ON "players"("playerNumber");

-- CreateIndex
CREATE INDEX "fixtures_date_idx" ON "fixtures"("date");

-- CreateIndex
CREATE INDEX "goal_events_fixtureId_idx" ON "goal_events"("fixtureId");

-- CreateIndex
CREATE INDEX "goal_events_playerId_idx" ON "goal_events"("playerId");

-- AddForeignKey
ALTER TABLE "goal_events" ADD CONSTRAINT "goal_events_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "fixtures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_events" ADD CONSTRAINT "goal_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;
