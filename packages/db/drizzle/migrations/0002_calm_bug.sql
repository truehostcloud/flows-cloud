ALTER TABLE "event" ALTER COLUMN "user_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "step_index" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "step_index" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "step_hash" DROP NOT NULL;