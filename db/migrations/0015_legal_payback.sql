CREATE TABLE "paymentSchema" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"platform" text,
	"endpointId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userSchema" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"platform" text,
	"endpointId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "paymentSchema" ADD CONSTRAINT "paymentSchema_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userSchema" ADD CONSTRAINT "userSchema_endpointId_endpoints_id_fk" FOREIGN KEY ("endpointId") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN "enabledFields";