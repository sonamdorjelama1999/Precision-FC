/*
  Warnings:

  - You are about to drop the `fixtures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `goal_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactReason" AS ENUM ('GENERAL', 'SPONSORSHIP', 'MEDIA', 'OTHER');

-- DropForeignKey
ALTER TABLE "goal_events" DROP CONSTRAINT "goal_events_fixtureId_fkey";

-- DropForeignKey
ALTER TABLE "goal_events" DROP CONSTRAINT "goal_events_playerId_fkey";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3);

-- DropTable
DROP TABLE "fixtures";

-- DropTable
DROP TABLE "goal_events";

-- DropEnum
DROP TYPE "GoalTeam";

-- DropEnum
DROP TYPE "MatchStatus";

-- CreateTable
CREATE TABLE "news_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverUrl" TEXT,
    "coverPath" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" "ContactReason" NOT NULL DEFAULT 'GENERAL',
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_posts_slug_key" ON "news_posts"("slug");

-- CreateIndex
CREATE INDEX "news_posts_isPublished_publishedAt_idx" ON "news_posts"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "contact_messages_isRead_createdAt_idx" ON "contact_messages"("isRead", "createdAt");
