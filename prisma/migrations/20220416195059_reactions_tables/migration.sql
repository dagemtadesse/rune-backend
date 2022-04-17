/*
  Warnings:

  - You are about to drop the column `downvote` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `downvote` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "downvote",
DROP COLUMN "upvote";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "downvote",
DROP COLUMN "upvote";

-- CreateTable
CREATE TABLE "PostReaction" (
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "upvote" BOOLEAN NOT NULL DEFAULT false,
    "downvote" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "CommentReaction" (
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "upvote" BOOLEAN NOT NULL DEFAULT false,
    "downvote" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_userId_postId_key" ON "PostReaction"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentReaction_userId_commentId_key" ON "CommentReaction"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
