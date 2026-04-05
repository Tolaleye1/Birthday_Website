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

-- Admin access requests (Amendment 7)
CREATE TABLE IF NOT EXISTS admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public queries (non-deleted, sorted by recency)
CREATE INDEX IF NOT EXISTS idx_contributions_public 
  ON contributions (is_deleted, type, created_at DESC);

-- Index for laitan gallery display order
CREATE INDEX IF NOT EXISTS idx_laitan_gallery_order 
  ON laitan_gallery (display_order ASC);

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
