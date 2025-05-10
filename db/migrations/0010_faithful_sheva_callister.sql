ALTER TABLE "endpoints" ADD COLUMN "schema" text NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "projectId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;