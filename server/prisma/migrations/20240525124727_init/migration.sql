/*
  Warnings:

  - You are about to drop the `_PostTopics` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `topicId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PostTopics" DROP CONSTRAINT "_PostTopics_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostTopics" DROP CONSTRAINT "_PostTopics_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "topicId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PostTopics";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
