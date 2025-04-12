ALTER TABLE "telegramChannels" RENAME COLUMN "channelId" TO "chatId";--> statement-breakpoint
ALTER TABLE "telegramChannels" DROP CONSTRAINT "telegramChannels_channelId_unique";--> statement-breakpoint
ALTER TABLE "telegramChannels" ADD CONSTRAINT "telegramChannels_chatId_unique" UNIQUE("chatId");