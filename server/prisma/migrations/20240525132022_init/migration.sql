/*
  Warnings:

  - The primary key for the `MainTopic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MainTopic` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `mainTopicId` on the `Topic` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_mainTopicId_fkey";

-- AlterTable
ALTER TABLE "MainTopic" DROP CONSTRAINT "MainTopic_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MainTopic_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "mainTopicId",
ADD COLUMN     "mainTopicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_mainTopicId_fkey" FOREIGN KEY ("mainTopicId") REFERENCES "MainTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
