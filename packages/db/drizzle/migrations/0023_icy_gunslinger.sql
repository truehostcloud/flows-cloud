ALTER TABLE "organization_to_user" DROP CONSTRAINT "organization_to_user_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "human_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "human_id_project_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "organization_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "domain_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flow_human_id_idx" ON "flow" ("human_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "flow_human_id_project_id_idx" ON "flow" ("project_id","human_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_organization_id_idx" ON "project" ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_domain_idx" ON "project" ("domains");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_invite_email_idx" ON "user_invite" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_invite_organization_id_idx" ON "user_invite" ("organization_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_to_user" ADD CONSTRAINT "organization_to_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
