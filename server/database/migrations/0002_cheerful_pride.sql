CREATE TABLE "oauthAccounts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"userId" uuid NOT NULL,
	"providerId" integer NOT NULL,
	"accountId" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oauthAccounts_providerId_accountId_unique" UNIQUE("providerId","accountId")
);
--> statement-breakpoint
CREATE TABLE "oauthProviders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "oauthProviders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar(32) NOT NULL,
	"name" varchar(32) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oauthProviders_type_unique" UNIQUE("type")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "oauthAccounts" ADD CONSTRAINT "oauthAccounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "oauthAccounts" ADD CONSTRAINT "oauthAccounts_providerId_oauthProviders_id_fk" FOREIGN KEY ("providerId") REFERENCES "public"."oauthProviders"("id") ON DELETE cascade ON UPDATE cascade;