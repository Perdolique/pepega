ALTER TABLE "telegramDestinationConfigs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "telegramDestinationConfigs" CASCADE;--> statement-breakpoint
ALTER TABLE "notificationDestinations" ADD COLUMN "config" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "notificationDestinations" ADD COLUMN "telegramChannelId" integer;--> statement-breakpoint
ALTER TABLE "notificationDestinations" ADD CONSTRAINT "notificationDestinations_telegramChannelId_telegramChannels_id_fk" FOREIGN KEY ("telegramChannelId") REFERENCES "public"."telegramChannels"("id") ON DELETE cascade ON UPDATE cascade;