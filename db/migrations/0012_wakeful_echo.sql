ALTER TABLE "projects" ALTER COLUMN "starred" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "enabledFields" jsonb NOT NULL;