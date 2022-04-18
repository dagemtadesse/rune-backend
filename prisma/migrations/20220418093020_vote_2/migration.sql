/*
  Warnings:

  - You are about to drop the column `downvote` on the `PostReaction` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `PostReaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostReaction" DROP COLUMN "downvote",
DROP COLUMN "upvote",
ADD COLUMN     "vote" "Vote" NOT NULL DEFAULT E'NONE';
