ALTER TABLE "userSchema" RENAME COLUMN "platform" TO "tier";--> statement-breakpoint
ALTER TABLE "userSchema" ADD COLUMN "role" text;