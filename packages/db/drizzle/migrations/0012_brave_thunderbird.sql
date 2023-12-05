DO $$ BEGIN
 CREATE TYPE "flow_frequency" AS ENUM('once', 'every-time');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "flow" ADD COLUMN "frequency" "flow_frequency";