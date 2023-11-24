DO $$ BEGIN
 CREATE TYPE "flow_type" AS ENUM('cloud', 'local');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "flow" ALTER COLUMN "flow_type" SET DATA TYPE flow_type USING "flow_type"::flow_type;