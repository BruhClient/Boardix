CREATE TYPE "public"."subscription_type" AS ENUM('yearly', 'monthly');--> statement-breakpoint
CREATE TABLE "subscriptionSchema" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"userId" text,
	"region" text,
	"email" text,
	"type" "subscription_type" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"authorId" text NOT NULL,
	"endpointId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptionSchema" ADD CONSTRAINT "subscriptionSchema_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptionSchema" ADD CONSTRAINT "subscriptionSchema_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;