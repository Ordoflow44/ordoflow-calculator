-- Ordoflow Calculator - Database Update for Media & Settings
-- Run this SQL in PostgreSQL via Coolify terminal

-- 1. Create media table
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric
);

-- 2. Create settings table (global)
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar DEFAULT 'Ordoflow',
	"logo_id" integer,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

-- 3. Add media_id column to payload_locked_documents_rels
ALTER TABLE "payload_locked_documents_rels"
ADD COLUMN IF NOT EXISTS "media_id" integer;

-- 4. Add settings_id column to payload_locked_documents_rels
ALTER TABLE "payload_locked_documents_rels"
ADD COLUMN IF NOT EXISTS "settings_id" integer;

-- 5. Create indexes for media
CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");

-- 6. Create indexes for locked_documents_rels media
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");

-- 7. Add foreign key for media in locked_documents_rels
ALTER TABLE "payload_locked_documents_rels"
ADD CONSTRAINT "payload_locked_documents_rels_media_fk"
FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

-- 8. Add foreign key for settings logo
ALTER TABLE "settings"
ADD CONSTRAINT "settings_logo_id_media_id_fk"
FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

-- Done!
SELECT 'Database updated successfully!' as status;
