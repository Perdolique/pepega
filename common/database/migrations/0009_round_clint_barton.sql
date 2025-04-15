CREATE TABLE "telegramChannels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "telegramChannels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" uuid NOT NULL,
	"channelId" varchar NOT NULL,
	"status" varchar DEFAULT 'not_verified' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "telegramChannels_channelId_unique" UNIQUE("channelId")
);
--> statement-breakpoint
ALTER TABLE "telegramDestinationConfigs" ADD COLUMN "channelId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "telegramChannels" ADD CONSTRAINT "telegramChannels_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "telegramDestinationConfigs" ADD CONSTRAINT "telegramDestinationConfigs_channelId_telegramChannels_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."telegramChannels"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "telegramDestinationConfigs" DROP COLUMN "chatId";