CREATE TABLE "streamers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "streamers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" uuid NOT NULL,
	"twitchBroadcasterId" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "streamers_userId_twitchBroadcasterId_unique" UNIQUE("userId","twitchBroadcasterId")
);
--> statement-breakpoint
CREATE TABLE "webhooks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "webhooks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"streamerId" integer NOT NULL,
	"subscriptionType" varchar NOT NULL,
	"status" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "streamers" ADD CONSTRAINT "streamers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_streamerId_streamers_id_fk" FOREIGN KEY ("streamerId") REFERENCES "public"."streamers"("id") ON DELETE cascade ON UPDATE cascade;