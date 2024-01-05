CREATE TABLE IF NOT EXISTS "user_invite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "user_invite_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user_invite" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_id_idx" ON "user_invite" ("organization_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_invite" ADD CONSTRAINT "user_invite_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
