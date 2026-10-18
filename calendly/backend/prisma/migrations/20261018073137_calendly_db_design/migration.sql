/*
  Warnings:

  - Changed the type of `weekday` on the `availability_rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "availability_rules" DROP COLUMN "weekday",
ADD COLUMN     "weekday" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "availability_rules_user_id_weekday_idx" ON "availability_rules"("user_id", "weekday");
