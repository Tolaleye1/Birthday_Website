-- ============================================
-- Birthday Celebration Website — Supabase Schema
-- ============================================

-- Contributions table (text tributes, photos, videos)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('text', 'photo', 'video')),
  submitter_name TEXT NOT NULL,
  message TEXT,
  caption TEXT,
  asset_path TEXT,
  asset_url TEXT,
  asset_mime_type TEXT,
  asset_size_bytes BIGINT,
  video_duration_seconds INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laitan's Gallery table (admin-curated photos AND videos)
CREATE TABLE IF NOT EXISTS laitan_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_path TEXT NOT NULL,
  asset_url TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Amendment 11: fixed curated slots for "Laitan Over the Years" on the home page
-- Run this SQL in Supabase Dashboard SQL Editor if the table does not exist yet.
CREATE TABLE IF NOT EXISTS laitan_years_slots (
  position INTEGER PRIMARY KEY CHECK (position BETWEEN 1 AND 6),
  asset_path TEXT,
  asset_url TEXT,
  caption TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin access requests (Amendment 7)
CREATE TABLE IF NOT EXISTS admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site-wide visibility settings (Amendment 12)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('tributes_visible', 'false'),
  ('photos_visible', 'false'),
  ('videos_visible', 'false')
ON CONFLICT (key) DO NOTHING;

-- Index for public queries (non-deleted, sorted by recency)
CREATE INDEX IF NOT EXISTS idx_contributions_public 
  ON contributions (is_deleted, type, created_at DESC);

-- Index for laitan gallery display order
CREATE INDEX IF NOT EXISTS idx_laitan_gallery_order 
  ON laitan_gallery (display_order ASC);

-- Position is the primary key, so no extra index is needed for laitan_years_slots

-- ============================================
-- Migration (run if upgrading from v1.1)
-- ============================================
-- ALTER TABLE laitan_photos RENAME TO laitan_gallery;
-- ALTER TABLE laitan_gallery ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video'));

-- ============================================
-- Storage Buckets (run in Supabase Dashboard)
-- ============================================
-- 1. Create bucket "media" (public)
--    - Allow uploads for: image/jpeg, image/png, image/webp, image/heic,
--      video/mp4, video/quicktime, video/webm
--    - Max file size: 100MB
