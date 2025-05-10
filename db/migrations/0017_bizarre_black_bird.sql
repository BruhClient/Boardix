ALTER TABLE "userSchema" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "userSchema" ADD COLUMN "region" text;