-- DropIndex
DROP INDEX "Post_text_key";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "mediaUrl" DROP NOT NULL;
