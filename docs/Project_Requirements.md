# Project Requirements Document

## Project Overview

**Name:** Birthday Celebration Website  
**Mission:** Create a mobile-first celebration platform where guests can send text wishes, photo wishes, and video messages that the celebrant can enjoy and manage from a simple admin dashboard.  
**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth, Supabase Postgres, Supabase Storage, Vercel

## Product Vision

The product should feel warm, elegant, and ceremonial rather than generic. The visual law combines:

- Ceremonial gold and royal purple from the brand reference
- Romantic rose, berry, and blush card treatments from the UI references
- Editorial typography with a refined celebratory tone
- Mobile-first layouts with soft layering, rounded cards, and clear calls to action

## Target Users

- Guests submitting birthday wishes, photos, and short videos
- The celebrant and close circle viewing the full collection
- A single host admin managing contributions and removing unwanted entries

## Scope Notes

- Planning and architecture only in this phase
- No moderation or approval queue in v1
- Admin access should stay simple
- Video submissions are capped at 1 minute 30 seconds
- Mobile-first experience is the primary product target

## Functional Requirements

| FR ID | Description | User Story | Status |
| :--- | :--- | :--- | :--- |
| FR-001 | Create a landing page with celebrant introduction, event tone-setting, and clear calls to submit a wish or upload a video. | As a guest, I want an inviting landing page with obvious next steps, so that I can quickly participate in the celebration. | MUS |
| FR-002 | Allow guests to upload a video message with name and optional caption, enforcing a maximum duration of 90 seconds. | As a guest, I want to submit a short video greeting, so that I can share a more personal birthday message. | MUS |
| FR-003 | Provide a unified wish submission page that supports text wishes, photo-with-caption wishes, and video wishes. | As a guest, I want one simple page for all contribution types, so that I can choose the format that suits me best. | MUS |
| FR-004 | Display public media contributions in a gallery with separate video and photo views. | As a visitor, I want to browse photos and videos separately, so that I can enjoy the celebration content in an organized way. | MUS |
| FR-005 | Display all text wishes in a visually rich wishes wall layout. | As a visitor, I want to read everyone’s written wishes in a beautiful wall, so that the collective love feels memorable and immersive. | MUS |
| FR-006 | Provide a simple admin dashboard with secure sign-in, contribution listing, and delete controls for all submission types. | As the host admin, I want to review and remove submissions from one place, so that I can keep the site tidy without a full user system. | MUS |
| FR-007 | Store contribution metadata and media assets reliably with validation for file type, file size, and submission completeness. | As the host, I want uploads and records to be validated consistently, so that the gallery stays performant and the data remains manageable. | MUS |
| FR-008 | Deliver a responsive, accessible, and performant mobile-first experience across all core pages. | As a mobile visitor, I want every page and form to work smoothly on my phone, so that participating feels effortless. | MUS |
| FR-009 | Enable shareable links for individual contributions or themed gallery views. | As the celebrant, I want to share a specific memory or collection view, so that I can spotlight special moments with others. | Future |
| FR-010 | Add celebrant highlights such as featured messages, scheduled reveals, or keepsake exports. | As the host, I want optional storytelling features after launch, so that the site can evolve into a richer digital keepsake. | Future |

## MUS User Stories

- As a first-time visitor, I can understand the celebration instantly from the landing page.
- As a guest, I can submit a text wish in a few taps.
- As a guest, I can upload a photo with a caption without confusion.
- As a guest, I can upload a short video without breaking file or duration rules.
- As a visitor, I can browse the gallery by media type.
- As a visitor, I can read heartfelt text wishes in an attractive layout.
- As the admin, I can sign in simply and remove submissions that should not remain live.

## Non-Goals for v1

- Multi-admin roles and permissions
- Comment threads, likes, or reactions
- Editing submissions after publish
- Private per-user accounts
- Moderation queues or approval workflows
- Advanced search or tagging

## Success Criteria

- Guests can submit all three contribution types with low friction on mobile
- The celebrant can view a full collection of wishes, photos, and videos in one branded experience
- The admin can manage submissions without developer assistance
- Media storage and delivery remain simple enough for a solo developer to maintain
