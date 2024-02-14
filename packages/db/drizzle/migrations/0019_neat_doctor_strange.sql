ALTER TABLE "event" ADD COLUMN "sdk_version" text DEFAULT '0.0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "target_element" text;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "location" text DEFAULT '' NOT NULL;