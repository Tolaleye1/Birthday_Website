# Visual Sitemap

## Site Structure

| Page | Route | Purpose | Key Components |
| :--- | :--- | :--- | :--- |
| Home | `/` | Landing page with celebrant introduction and clear submission paths | Hero (portrait placeholder, tagline, gold accent), BiographySection (truncated + "Read More" link), LaitanThroughTheYears grid, ParticipateCards, RecentTributesPreview, BibleVerseSection, Footer |
| Upload Video | `/upload-video` | Dedicated video submission form with clear guidelines and file picker | PageIntro, VideoUploadForm (NameField, CaptionField, VideoPicker, DurationHint), UploadGuidelinesCard, SubmitButton, Footer |
| Send a Tribute | `/submit-tribute` | Unified tribute submission supporting text, photo, and video | PageIntro, TributeTypeTabs (TextForm, PhotoForm, VideoForm), Footer |
| Gallery | `/gallery` | Public media showcase with 3 tabbed views | PageIntro, MediaTypeTabs (VideosTab, PhotosTab, LaitansGalleryTab), MediaCard grid, EmptyState, CTA (hidden on Laitan's tab), Footer |
| Tributes Wall | `/tributes` | Masonry display of all text tributes | PageIntro, TributeMasonry grid, TributeCard (name, message, timestamp, avatar), Footer |
| Gift the Celebrant | `/gift` | Placeholder page for gifting/account details | PageIntro, PlaceholderCard ("Account details coming soon"), Footer |
| Admin Dashboard | `/admin` | Secure management view with approval-gated access | AdminHeader, AccessRequestForm (email → approval flow), SubmissionFilters (type), SubmissionTable, DeleteAction, LaitanGalleryManager (photo+video upload/delete), Footer |

## Navigation Flow

```
Home
 |-- "Send a Tribute" CTA --> Send a Tribute
 |-- "About Olakiitan" Nav --> /#biography (scroll)
 |-- "Gift the Celebrant" Nav --> Gift the Celebrant
 |-- Nav: Gallery --> Gallery
 |-- Nav: Tributes --> Tributes Wall

Send a Tribute
 |-- Success --> Gallery or Tributes Wall (depending on type)

Upload Video
 |-- Success --> Gallery

Gift the Celebrant
 |-- "Back to Home" --> Home

Admin Dashboard
 |-- Request Access gate (email → owner approval → magic link)
 |-- Manage all submission types from one view
 |-- Upload/delete Laitan's Gallery items
```

## Page Priority (Build Order)

1. Home (brand impression, CTA routing)
2. Send a Tribute (core guest action)
3. Upload Video (core guest action)
4. Gallery (public consumption)
5. Tributes Wall (public consumption)
6. Gift the Celebrant (placeholder)
7. Admin Dashboard (host operations)
