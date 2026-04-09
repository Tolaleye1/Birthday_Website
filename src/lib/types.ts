export type ContributionType = "text" | "photo" | "video";

export interface Contribution {
  id: string;
  type: ContributionType;
  submitter_name: string;
  message: string | null;
  caption: string | null;
  asset_path: string | null;
  asset_url: string | null;
  asset_mime_type: string | null;
  asset_size_bytes: number | null;
  video_duration_seconds: number | null;
  is_deleted: boolean;
  created_at: string;
}

export interface LaitanGalleryItem {
  id: string;
  asset_path: string;
  asset_url: string | null;
  caption: string | null;
  display_order: number;
  media_type: "photo" | "video";
  created_at: string;
}

export interface LaitanYearSlot {
  position: number;
  asset_path: string | null;
  asset_url: string | null;
  caption: string | null;
  updated_at: string;
}

export interface LaitanYearSlot {
  position: number;
  asset_path: string | null;
  asset_url: string | null;
  caption: string | null;
  updated_at: string;
}

/* ── Validation Constants ── */
export const MAX_VIDEO_DURATION_SECONDS = 90;
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];
export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];
export const ALLOWED_GALLERY_TYPES = [
  ...ALLOWED_PHOTO_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

export const ADMIN_EMAIL = "admin@olakiitan50.com";
