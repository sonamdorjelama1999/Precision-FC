/*
  Warnings:

  - A unique constraint covering the columns `[teamId,playerNumber]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "players_playerNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "players_teamId_playerNumber_key" ON "players"("teamId", "playerNumber");
