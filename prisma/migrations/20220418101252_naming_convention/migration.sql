/*
  Warnings:

  - The values [UPVOTE,DOWNVOTE] on the enum `Vote` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Vote_new" AS ENUM ('UP_VOTE', 'DOWN_VOTE', 'NONE');
ALTER TABLE "PostReaction" ALTER COLUMN "vote" DROP DEFAULT;
ALTER TABLE "CommentReaction" ALTER COLUMN "vote" DROP DEFAULT;
ALTER TABLE "PostReaction" ALTER COLUMN "vote" TYPE "Vote_new" USING ("vote"::text::"Vote_new");
ALTER TABLE "CommentReaction" ALTER COLUMN "vote" TYPE "Vote_new" USING ("vote"::text::"Vote_new");
ALTER TYPE "Vote" RENAME TO "Vote_old";
ALTER TYPE "Vote_new" RENAME TO "Vote";
DROP TYPE "Vote_old";
ALTER TABLE "PostReaction" ALTER COLUMN "vote" SET DEFAULT 'NONE';
ALTER TABLE "CommentReaction" ALTER COLUMN "vote" SET DEFAULT 'NONE';
COMMIT;
