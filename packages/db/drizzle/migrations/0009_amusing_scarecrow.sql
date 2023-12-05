ALTER TABLE "project" DROP CONSTRAINT "project_organization_id_organization_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
