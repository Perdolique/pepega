ALTER TABLE "streamers" RENAME COLUMN "twitchBroadcasterId" TO "broadcasterId";--> statement-breakpoint
ALTER TABLE "streamers" DROP CONSTRAINT "streamers_userId_twitchBroadcasterId_unique";--> statement-breakpoint
ALTER TABLE "streamers" DROP CONSTRAINT "streamers_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "streamers" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "streamers" ADD COLUMN "nickname" varchar;--> statement-breakpoint
ALTER TABLE "streamers" ADD CONSTRAINT "streamers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "streamers" ADD CONSTRAINT "streamers_userId_broadcasterId_unique" UNIQUE("userId","broadcasterId");