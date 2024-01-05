ALTER TABLE "flow" RENAME COLUMN "flow_version_id" TO "published_version_id";--> statement-breakpoint
ALTER TABLE "flow" RENAME COLUMN "published_at" TO "enabled_at";--> statement-breakpoint
ALTER TABLE "flow" DROP CONSTRAINT "flow_flow_version_id_flow_version_id_fk";
--> statement-breakpoint
ALTER TABLE "flow_version" ADD COLUMN "frequency" "flow_frequency" DEFAULT 'once' NOT NULL;--> statement-breakpoint
ALTER TABLE "flow_version" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "flow_version" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "flow" ADD COLUMN "draft_version_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flow" ADD CONSTRAINT "flow_published_version_id_flow_version_id_fk" FOREIGN KEY ("published_version_id") REFERENCES "flow_version"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flow" ADD CONSTRAINT "flow_draft_version_id_flow_version_id_fk" FOREIGN KEY ("draft_version_id") REFERENCES "flow_version"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "flow" DROP COLUMN IF EXISTS "frequency";