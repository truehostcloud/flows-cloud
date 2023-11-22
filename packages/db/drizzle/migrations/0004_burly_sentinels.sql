CREATE TABLE IF NOT EXISTS "organization_to_user" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid,
	"email" varchar,
	"created_at" timestamp,
	"updated_at" timestamp,
	"confirmed_at" timestamp,
	"last_sign_in_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_to_user" ADD CONSTRAINT "organization_to_user_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_to_user" ADD CONSTRAINT "organization_to_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
