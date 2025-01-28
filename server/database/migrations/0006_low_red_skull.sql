ALTER TABLE "webhooks" RENAME COLUMN "subscriptionType" TO "type";--> statement-breakpoint
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_streamerId_subscriptionType_unique";--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_streamerId_type_unique" UNIQUE("streamerId","type");