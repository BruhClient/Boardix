ALTER TABLE "eventSchema" ADD COLUMN "authorId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "paymentSchema" ADD COLUMN "authorId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "userSchema" ADD COLUMN "authorId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "eventSchema" ADD CONSTRAINT "eventSchema_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentSchema" ADD CONSTRAINT "paymentSchema_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userSchema" ADD CONSTRAINT "userSchema_authorId_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;