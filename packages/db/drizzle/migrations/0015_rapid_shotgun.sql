DROP INDEX IF EXISTS "human_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "human_id_alias_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "human_id_organization_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_id_idx" ON "project" ("organization_id");--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "human_id";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN IF EXISTS "human_id_alias";