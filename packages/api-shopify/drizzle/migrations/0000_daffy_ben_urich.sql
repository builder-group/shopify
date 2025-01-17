CREATE TABLE IF NOT EXISTS "shopify_session" (
	"id" text PRIMARY KEY NOT NULL,
	"app" text NOT NULL,
	"shop" text NOT NULL,
	"state" text NOT NULL,
	"isOnline" boolean DEFAULT false NOT NULL,
	"scope" text,
	"expires" timestamp,
	"accessToken" text,
	"userId" bigint
);
