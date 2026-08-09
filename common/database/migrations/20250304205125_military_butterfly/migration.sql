ALTER TABLE "streamers" RENAME COLUMN "nickname" TO "displayName";--> statement-breakpoint
ALTER TABLE "streamers" ADD COLUMN "login" varchar;