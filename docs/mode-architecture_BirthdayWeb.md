# Architecture: Birthday Celebration Website

**Date:** 2026-04-02  
**Mode:** takomi `mode-architect` + `vibe-genesis`

## Overview

This project is best implemented as a content-driven celebration microsite built on the Next.js ecosystem, with Supabase handling authentication, database, and file storage. The design language should blend two references into one coherent system:

- The brand image establishes the official palette: royal purple, orchid, rich gold, and ivory.
- The UI references establish the interaction tone: soft rounded cards, layered depth, romantic reds and blush tones, gentle glow, and intimate editorial copy.

The resulting product should feel premium, warm, and celebratory on mobile while staying straightforward for a solo builder to ship and maintain.

## Discovery Summary

**Problem:** The celebrant needs a dedicated website where loved ones can contribute video messages, photo wishes, and text wishes, while a single host can manage everything from a simple dashboard.  
**Users:** Guests, viewers, and one admin host.  
**Constraints:** Planning only, no implementation yet, mobile-first, no approval flow, simple admin auth, 90-second video cap, no em dashes in generated docs.  
**Existing Patterns:** No working app is present yet. The project currently contains visual references only.

## Goals

- Launch a polished mobile-first birthday site with clear submission paths
- Support text, photo, and video contributions in v1
- Keep deployment, storage, and admin operations simple for one developer
- Preserve the emotional tone of a celebratory keepsake rather than a generic gallery app

## Non-Goals

- Full account systems for guests
- Moderation pipelines
- Complex media processing or editing tools
- Community features like comments or reactions

## Visual Law

### Palette Direction

- Primary royal purple: use for brand anchors, headings, key backgrounds
- Accent orchid and berry: use for cards, gradients, hover states, and emotional warmth
- Ceremonial gold: use sparingly for highlights, badges, separators, CTA emphasis
- Blush pink and soft rose: use for supportive surfaces and romantic contrast
- Warm ivory: use for readable content surfaces and whitespace balance

### Typography Feel

- Display typography should feel elegant and commemorative, with high-contrast or serif-led headline styling
- Interface typography should be clean, rounded, and highly legible on mobile
- Script accents can be used sparingly for signatures, section flourishes, or celebrant name treatments

### Layout Tone

- Full-bleed hero moments with layered shapes and a strong portrait or celebrant focus
- Rounded elevated cards instead of plain flat containers
- Gentle gradients, glow, confetti motifs, ribbon details, and soft shadows
- Clear CTA hierarchy with no clutter on small screens

## Recommended Stack

### Frontend

**Recommendation:** Next.js 15 App Router with TypeScript and Tailwind CSS, deployed on Vercel.

**Why this fits**

- Best balance of speed, maintainability, and deployment simplicity for a solo developer
- Server components and route handlers reduce backend overhead
- Strong support for image optimization, metadata, routing, and form-driven UX
- Vercel preview deployments make iteration easy during a design-heavy build

### Backend and Storage

**Recommendation:** Supabase for Postgres, Auth, and Storage.

**Why Supabase is the best-fit single backend solution**

- One platform covers database, object storage, and admin authentication
- Postgres is excellent for structured contribution records and simple querying
- Storage buckets handle photo and video assets cleanly
- Magic-link auth for one admin email is simpler and safer than a shared password
- Real-time capabilities exist if later needed, without forcing extra infrastructure now
- DX is smoother than stitching together separate auth, DB, and storage vendors

## Alternative Options Considered

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Next.js + Supabase | Unified backend, great DX, simple auth, Postgres flexibility, storage in one place | Requires careful storage rules and upload validation | Recommended |
| Next.js + Firebase | Strong storage and auth, easy client SDK | Firestore document modeling is less natural for relational admin views and future reporting | Not preferred |
| Next.js + Convex + third-party storage | Great realtime DX | Adds another vendor for media storage and more moving parts for a solo build | Not preferred |

## Key Architectural Decisions

1. Use a single `contributions` table for v1 rather than multiple subtype tables.
2. Store photos and videos in Supabase Storage under separate folder prefixes in one public media bucket.
3. Use signed upload URLs to control who can upload while allowing efficient direct-to-storage transfers.
4. Use a magic-link admin login restricted to a single configured email.
5. Keep all guest interactions unauthenticated to minimize friction.
6. Hard delete is acceptable for v1 if operational simplicity is preferred.

## High-Level System Components

1. **Public Web App**  
   Landing page, submission flows, gallery, and wishes wall.

2. **Submission API Layer**  
   Creates signed upload URLs, validates inputs, and writes contribution metadata.

3. **Supabase Postgres**  
   Stores contribution records and admin profile settings if needed.

4. **Supabase Storage**  
   Stores uploaded image and video assets for gallery delivery.

5. **Admin Dashboard**  
   Secured management view for listing and deleting contributions.

## Proposed Data Model

### Table: `contributions`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `type` | `enum('text','photo','video')` | Determines rendering and validation |
| `submitter_name` | `text` | Required, trimmed, length-limited |
| `message` | `text` | Used for text wishes only |
| `caption` | `text` | Optional for photo and video submissions |
| `asset_path` | `text` | Storage path for photo or video |
| `asset_url` | `text` | Public delivery URL or derived URL |
| `asset_mime_type` | `text` | For validation and rendering |
| `asset_size_bytes` | `bigint` | Track upload size |
| `video_duration_seconds` | `integer` | Required for video submissions |
| `thumbnail_url` | `text` | Optional future thumbnail support |
| `source_page` | `text` | `upload-video` or `submit-wish` for analytics and debugging |
| `is_deleted` | `boolean` | Default `false` |
| `created_at` | `timestamptz` | Default now |
| `updated_at` | `timestamptz` | Maintained on mutation |

### Validation Rules

- `submitter_name` required for every contribution
- `message` required when `type = text`
- `asset_path` required when `type = photo` or `type = video`
- `video_duration_seconds <= 90` for all video contributions
- Allowed image types: `image/jpeg`, `image/png`, `image/webp`
- Allowed video types: `video/mp4`, `video/quicktime`, optionally `video/webm`
- File size limits should be explicitly set for photos and videos during build

### Optional Table: `admin_allowlist`

This table is only needed if admin emails may change without redeploying. For a single static admin email, an environment variable is enough.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `email` | `text` | Allowed admin email |
| `created_at` | `timestamptz` | Audit trail |

## Storage Design

### Bucket

- `birthday-media` public-read bucket

### Folder Strategy

- `photos/YYYY/MM/<uuid>-<sanitized-name>.jpg`
- `videos/YYYY/MM/<uuid>-<sanitized-name>.mp4`

### Why public-read storage is acceptable here

- Submitted media is intended for public display on the site
- Gallery performance is simpler with directly cacheable public URLs
- Upload rights remain controlled through server-generated signed upload instructions

## API Design

The build should favor Next.js route handlers under `app/api`.

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/uploads/sign` | Return a signed upload target for photo or video files | Public with server validation |
| `POST` | `/api/submissions/text` | Create a text wish | Public |
| `POST` | `/api/submissions/media` | Create photo or video metadata record after successful upload | Public |
| `GET` | `/api/gallery/photos` | List recent photo contributions | Public |
| `GET` | `/api/gallery/videos` | List recent video contributions | Public |
| `GET` | `/api/wishes` | List text wishes for the wishes wall | Public |
| `GET` | `/api/admin/submissions` | List all non-deleted submissions with filters | Admin |
| `DELETE` | `/api/admin/submissions/:id` | Delete one contribution and its asset if present | Admin |

## API Contract Notes

### `POST /api/uploads/sign`

Input:

- `fileName`
- `mimeType`
- `fileSize`
- `contributionType`

Behavior:

- Reject disallowed MIME types
- Reject oversized files
- Reject media types outside `photo` and `video`
- Return a storage path and signed upload instructions

### `POST /api/submissions/text`

Input:

- `submitterName`
- `message`

Behavior:

- Trim and validate text lengths
- Insert a `text` contribution record

### `POST /api/submissions/media`

Input:

- `type`
- `submitterName`
- `caption`
- `assetPath`
- `assetMimeType`
- `assetSizeBytes`
- `videoDurationSeconds` when `type = video`
- `sourcePage`

Behavior:

- Confirm required fields per media type
- Enforce 90-second video ceiling
- Insert contribution record

## Page Architecture

### Public Routes

- `/` landing / hero
- `/upload-video`
- `/submit-wish`
- `/gallery`
- `/wishes`

### Admin Routes

- `/admin/login`
- `/admin`

## Component Tree

```text
App
|-- RootLayout
|   |-- BrandBackground
|   |-- GlobalHeader
|   |-- Footer
|
|-- HomePage
|   |-- HeroSection
|   |-- CelebrationIntro
|   |-- PrimaryCTAGroup
|   |-- ContributionPreview
|   |-- EventDetailStrip
|
|-- UploadVideoPage
|   |-- PageIntro
|   |-- VideoUploadForm
|   |   |-- NameField
|   |   |-- CaptionField
|   |   |-- VideoPicker
|   |   |-- DurationHint
|   |   |-- SubmitButton
|   |-- UploadGuidelinesCard
|
|-- SubmitWishPage
|   |-- PageIntro
|   |-- WishTypeTabs
|   |   |-- TextWishForm
|   |   |-- PhotoWishForm
|   |   |-- VideoWishForm
|   |-- EncouragementPanel
|
|-- GalleryPage
|   |-- PageIntro
|   |-- MediaTypeTabs
|   |   |-- PhotoGrid
|   |   |-- VideoGrid
|   |-- EmptyState
|
|-- WishesWallPage
|   |-- PageIntro
|   |-- WishMasonry
|   |-- WishCard
|
|-- AdminLoginPage
|   |-- MagicLinkForm
|
|-- AdminDashboardPage
|   |-- DashboardHeader
|   |-- SubmissionFilters
|   |-- SubmissionTableOrCards
|   |-- DeleteAction
```

## Rendering Strategy

- Use server-rendered listing pages for fast first paint and simple SEO.
- Hydrate only the interactive parts: tabs, upload forms, and admin actions.
- Paginate gallery and wishes views once content volume grows.

## Admin Authentication Recommendation

**Recommended:** Supabase magic-link auth for one admin email address.

**Why**

- Much safer than a shared password embedded in the app
- Minimal UX complexity
- No need for a full user system
- Easy to revoke by changing the allowlisted email

**Fallback if simplicity is valued over safety**

- Single password gate stored in environment variables

This fallback is acceptable only for a private low-risk event site, but magic link remains the recommended path.

## Security and Validation Strategy

- Validate file type and size before issuing upload instructions
- Re-validate metadata server-side before inserting DB records
- Enforce the 90-second cap for videos using browser metadata and server-side constraints where possible
- Restrict admin routes to authenticated admin email only
- Rate limiting is optional for v1, but the build should leave room for it if spam appears

## Performance Strategy

- Direct-to-storage uploads avoid pushing large media through the app server
- Serve images with optimized display sizes and lazy loading
- Use preview posters or thumbnails for video cards
- Paginate gallery results after the first content page
- Cache public reads where appropriate through Vercel and Storage CDN behavior

## Accessibility Strategy

- Maintain strong color contrast despite decorative gradients
- Ensure all forms have visible labels and clear inline validation
- Make tab systems keyboard accessible
- Provide captions and supportive helper text for upload limits
- Avoid autoplaying audio or video on landing screens

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Large video uploads feel slow on mobile networks | High | High | Use direct storage uploads, show progress, keep size guidance visible, enforce 90-second limit |
| Public upload endpoints attract spam | Medium | Medium | Add lightweight server validation, honeypot field, and optional rate limiting |
| Mixed visual references create inconsistent UI | Medium | High | Treat gold-purple ceremonial branding as primary law and use rose/blush card styling only as supporting warmth |
| Admin deletes media records but not files, or vice versa | Medium | Medium | Centralize delete flow so DB and storage deletion happen together |
| Gallery performance degrades as assets grow | Medium | Medium | Use pagination, thumbnails, and optimized media delivery |
| Magic-link delivery issues block admin access | Low | Medium | Keep a documented fallback admin access method or allowlist update procedure |

## Build-Phase Implementation Plan

### Phase 1: Foundation

- Set up Next.js app shell, theme tokens, and route map
- Configure Supabase project, storage bucket, and auth
- Create `contributions` schema and basic validation contracts

### Phase 2: Public Submission Flows

- Build landing page
- Build upload video page
- Build submit wish page with text, photo, and video variants
- Connect upload and submission APIs

### Phase 3: Public Consumption Views

- Build gallery with photo and video tabs
- Build wishes wall
- Add loading, empty, and error states

### Phase 4: Admin Operations

- Implement admin login
- Build contribution list with delete action
- Ensure delete removes both record and asset

### Phase 5: Polish

- Refine mobile spacing and animations
- Add accessibility pass
- Tune performance and metadata

## Acceptance Priorities

1. Reliable submissions
2. Beautiful public viewing experience
3. Admin deletion workflow
4. Performance and polish

## Builder Guardrails

- Do not introduce a guest account system
- Do not build moderation queues
- Keep data modeling simple unless growth demands more normalization
- Preserve the celebratory editorial tone and avoid generic dashboard styling on public pages

## Open Questions

- Will there be one celebrant portrait set for the hero, or should the build support a configurable media slot?
- Should deleted items be hard-deleted immediately or soft-deleted first for recovery?
- Are public video files acceptable, or should playback URLs become signed in a future privacy pass?
