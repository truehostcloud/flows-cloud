ALTER TABLE "flow_version" DROP CONSTRAINT "flow_version_flow_id_flow_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flow_version" ADD CONSTRAINT "flow_version_flow_id_flow_id_fk" FOREIGN KEY ("flow_id") REFERENCES "flow"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
