ALTER TABLE "paymentSchema" ADD COLUMN "paymentId" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "userSchema" ADD COLUMN "userId" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "paymentSchema" DROP COLUMN "id";