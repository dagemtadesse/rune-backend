-- CreateTable
CREATE TABLE "ChannelBookmark" (
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ChannelBookmark_pkey" PRIMARY KEY ("userId","channelId")
);

-- AddForeignKey
ALTER TABLE "ChannelBookmark" ADD CONSTRAINT "ChannelBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelBookmark" ADD CONSTRAINT "ChannelBookmark_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
