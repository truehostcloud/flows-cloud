DO $$ BEGIN
 CREATE TYPE "event_type" AS ENUM('startFlow', 'nextStep', 'prevStep', 'tooltipError', 'cancelFlow', 'finishFlow');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "event_type" "event_type";