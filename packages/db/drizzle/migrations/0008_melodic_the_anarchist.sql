ALTER TABLE "flow" DROP CONSTRAINT "flow_project_id_project_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flow" ADD CONSTRAINT "flow_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
