-- CreateTable
CREATE TABLE "RecommendedTopic" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "RecommendedTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecommendedTopic" ADD CONSTRAINT "RecommendedTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedTopic" ADD CONSTRAINT "RecommendedTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
