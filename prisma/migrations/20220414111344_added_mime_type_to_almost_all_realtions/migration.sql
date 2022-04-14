-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "mimeType" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "mimeType" TEXT;
