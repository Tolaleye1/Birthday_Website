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

-- Laitan's Photos table (admin-curated)
CREATE TABLE IF NOT EXISTS laitan_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_path TEXT NOT NULL,
  asset_url TEXT,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public queries (non-deleted, sorted by recency)
CREATE INDEX IF NOT EXISTS idx_contributions_public 
  ON contributions (is_deleted, type, created_at DESC);

-- Index for laitan photos display order
CREATE INDEX IF NOT EXISTS idx_laitan_photos_order 
  ON laitan_photos (display_order ASC);

-- ============================================
-- Storage Buckets (run in Supabase Dashboard)
-- ============================================
-- 1. Create bucket "media" (public)
--    - Allow uploads for: image/jpeg, image/png, image/webp, image/heic,
--      video/mp4, video/quicktime, video/webm
--    - Max file size: 100MB
