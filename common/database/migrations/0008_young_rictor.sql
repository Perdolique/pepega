CREATE TABLE "notificationDestinations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notificationDestinations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"notificationId" integer NOT NULL,
	"providerId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificationProviders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notificationProviders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notificationProviders_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"streamerId" integer NOT NULL,
	"eventType" varchar NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_streamerId_eventType_unique" UNIQUE("streamerId","eventType")
);
--> statement-breakpoint
CREATE TABLE "telegramDestinationConfigs" (
	"destinationId" integer PRIMARY KEY NOT NULL,
	"chatId" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notificationDestinations" ADD CONSTRAINT "notificationDestinations_notificationId_notifications_id_fk" FOREIGN KEY ("notificationId") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notificationDestinations" ADD CONSTRAINT "notificationDestinations_providerId_notificationProviders_id_fk" FOREIGN KEY ("providerId") REFERENCES "public"."notificationProviders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_streamerId_streamers_id_fk" FOREIGN KEY ("streamerId") REFERENCES "public"."streamers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "telegramDestinationConfigs" ADD CONSTRAINT "telegramDestinationConfigs_destinationId_notificationDestinations_id_fk" FOREIGN KEY ("destinationId") REFERENCES "public"."notificationDestinations"("id") ON DELETE cascade ON UPDATE cascade;