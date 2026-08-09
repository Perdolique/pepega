ALTER TABLE "telegramChannels" ADD COLUMN "isVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "telegramChannels" DROP COLUMN "verificationStatus";