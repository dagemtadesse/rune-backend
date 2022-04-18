/*
  Warnings:

  - You are about to drop the column `downvote` on the `CommentReaction` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `CommentReaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Vote" AS ENUM ('UPVOTE', 'DOWNVOTE', 'NONE');

-- AlterTable
ALTER TABLE "CommentReaction" DROP COLUMN "downvote",
DROP COLUMN "upvote",
ADD COLUMN     "vote" "Vote" NOT NULL DEFAULT E'NONE';
