/*
  Warnings:

  - The primary key for the `MainTopic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `mainTopicId` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_mainTopicId_fkey";

-- AlterTable
ALTER TABLE "MainTopic" DROP CONSTRAINT "MainTopic_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MainTopic_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MainTopic_id_seq";

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "mainTopicId" SET NOT NULL,
ALTER COLUMN "mainTopicId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_mainTopicId_fkey" FOREIGN KEY ("mainTopicId") REFERENCES "MainTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
