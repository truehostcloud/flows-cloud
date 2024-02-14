UPDATE EVENT
SET 
  event_type = type::event_type
WHERE
  event_type IS NULL;
  
ALTER TABLE "event" ALTER COLUMN "event_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "type";