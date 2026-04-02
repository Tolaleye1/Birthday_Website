# Visual Sitemap

## Site Structure

| Page | Route | Purpose | Key Components |
| :--- | :--- | :--- | :--- |
| Home | `/` | Landing page with celebrant introduction, event context, and clear submission paths | Hero (portrait placeholder, tagline, gold accent), CelebrationIntro, PrimaryCTAGroup ("Send a Tribute", "Upload a Video"), RecentContributionsPreview, EventDetailStrip, Footer |
| Upload Video | `/upload-video` | Dedicated video submission form with clear guidelines and file picker | PageIntro, VideoUploadForm (NameField, CaptionField, VideoPicker, DurationHint), UploadGuidelinesCard, SubmitButton, Footer |
| Send a Tribute | `/submit-wish` | Unified tribute submission supporting text, photo+caption, and video message | PageIntro, WishTypeTabs (TextWishForm, PhotoWishForm, VideoWishForm), EncouragementPanel, Footer |
| Gallery | `/gallery` | Public media showcase with tabbed views for photos and videos | PageIntro, MediaTypeTabs (PhotosTab, VideosTab), MediaCard grid (2-col mobile, 3-col desktop), EmptyState, Footer |
| Tributes Wall | `/tributes` | Visually rich display of all text tributes in masonry layout | PageIntro, WishMasonry grid, WishCard (name, message, timestamp, decorative accents), Footer |
| Admin Dashboard | `/admin` | Secure management view for reviewing, filtering, and deleting contributions | AdminHeader, StatsRow (total wishes, total videos, total photos), SubmissionFilters (type, date), SubmissionTable/Cards, DeleteAction, AdminLogin gate |

## Navigation Flow

```
Home
 |-- "Send a Tribute" CTA --> Send a Tribute
 |-- "Upload a Video" CTA --> Upload Video
 |-- Nav: Gallery --> Gallery
 |-- Nav: Tributes --> Tributes Wall
 |-- Footer: Admin link --> Admin Dashboard

Send a Tribute
 |-- Success --> Gallery or Tributes Wall (depending on type)

Upload Video
 |-- Success --> Gallery

Admin Dashboard
 |-- Login gate (magic link or password)
 |-- Manage all submission types from one view
```

## Page Priority (Build Order)

1. Home (brand impression, CTA routing)
2. Send a Tribute (core guest action)
3. Upload Video (core guest action)
4. Gallery (public consumption)
5. Tributes Wall (public consumption)
6. Admin Dashboard (host operations)
