ALTER TABLE "paymentSchema" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "userSchema" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;