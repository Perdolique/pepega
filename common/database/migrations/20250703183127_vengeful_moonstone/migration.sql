DROP INDEX "webhooks_subscriptionId_index";--> statement-breakpoint
CREATE INDEX "streamers_broadcasterId_index" ON "streamers" USING btree ("broadcasterId");--> statement-breakpoint
CREATE INDEX "webhooks_subscriptionId_type_index" ON "webhooks" USING btree ("subscriptionId","type");