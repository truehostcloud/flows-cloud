ALTER TABLE "event" DROP CONSTRAINT "event_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_flow_id_flow_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_flow_id_flow_id_fk" FOREIGN KEY ("flow_id") REFERENCES "flow"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "project_id";