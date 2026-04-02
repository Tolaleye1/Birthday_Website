# Builder Prompt

## Stack-Specific Instructions

- Build on Next.js App Router with TypeScript and Tailwind CSS.
- Use Supabase as the single backend layer for Postgres, Storage, and admin auth.
- Prefer Next.js route handlers for server-side validation and signed upload orchestration.
- Use direct-to-storage uploads for photo and video files.
- Restrict admin access to one allowlisted email via Supabase magic-link auth.
- Keep the public side guest-friendly with no sign-in requirement.

## Visual System Notes

- Gold and royal purple from the brand image are the non-negotiable brand anchors.
- Rose, berry, and blush surfaces from the UI references should warm the experience without replacing the core palette.
- Use elegant display typography and clean mobile UI typography.
- Favor layered hero sections, rounded editorial cards, subtle glow, and intentional spacing.
- Avoid generic SaaS-looking sections on public pages.

## MUS Priority Order

1. FR-007: Storage, validation, and submission contracts
2. FR-001: Landing page and CTA flow
3. FR-002: Dedicated upload video page
4. FR-003: Unified submit-a-wish page
5. FR-004: Gallery with photos and videos
6. FR-005: Wishes wall
7. FR-006: Admin login and dashboard
8. FR-008: Responsive, accessible, and performant polish

## Build Guardrails

- No moderation queue
- No guest accounts
- No advanced social features in v1
- No heavy custom backend if Next.js plus Supabase already covers the need
- Keep media handling simple and reliable over over-engineered

## Special Considerations

- Video uploads must stay capped at 90 seconds.
- File size limits should be tuned for mobile realities before launch.
- Gallery pages should support pagination once content volume grows.
- Admin delete should remove database records and associated stored files in one flow.
- If visual conflicts appear, prefer the ceremonial gold-purple brand system over the softer rose reference system.

## Mandatory Mockup-Driven Implementation

The `/docs/mockups` folder is the **UNQUESTIONABLE source of truth** for all front-end UI/UX.
You must NOT deviate from the layout, color palette, typography, or component structure defined in the mockups.
Before implementing any page, open the corresponding mockup file and replicate it exactly.

### Design System Reference

- **Design System:** `docs/design/design-system.html` defines every colour, font, button, card, form element, and layout pattern.
- **Sitemap:** `docs/design/sitemap.md` maps every page to its purpose and key components.

### Mockup Files

| Page | Mockup File | Route |
| :--- | :--- | :--- |
| Home | `docs/mockups/home.html` | `/` |
| Upload Video | `docs/mockups/upload-video.html` | `/upload-video` |
| Send a Tribute | `docs/mockups/submit-wish.html` | `/submit-wish` |
| Gallery | `docs/mockups/gallery.html` | `/gallery` |
| Tributes Wall | `docs/mockups/tributes-wall.html` | `/tributes` |
| Admin Dashboard | `docs/mockups/admin.html` | `/admin` |

### Visual Tokens (from design system)

- **Fonts:** Playfair Display (display/headings), DM Sans (body/UI), Great Vibes (script/celebrant name)
- **Primary:** Royal Purple `#4B1D6E`, Gold `#C9A84C`
- **Warm Layer:** Berry `#7A1B3E`, Rose `#D4708F`, Blush `#F5D5E0`
- **Surfaces:** Ivory `#FFF8F0`, Cream `#FFFDF7`, White `#FFFFFF`
- **Text:** Dark `#1A0A2E`, Body `#3D2955`, Muted `#8E7BA7`
- **Border Radius:** Cards use 16px, buttons use pill (100px)
- **Shadows:** card `0 4px 24px rgba(75,29,110,0.10)`, glow `0 0 30px rgba(201,168,76,0.25)`
- **Hero Gradient:** `linear-gradient(135deg, #2D1048 0%, #4B1D6E 40%, #7A1B3E 100%)`

### Rules

- Open the mockup before coding any page.
- Match colours, spacing, border-radius, and typography exactly.
- Preserve all hover/transition effects defined in the mockups.
- Do not invent new colours or substitute generic Tailwind colours.
- The gold-purple ceremonial brand always takes priority over any ad hoc styling.

---

## Content Amendments (v1.1)

The following amendments were applied to the mockups after the initial design phase. Builders must be aware of these changes and implement accordingly.

### Amendment 1 — "Wishes" → "Tributes" Global Rename

All UI copy and routes have been updated:
- "Send a Wish" → "Send a Tribute"
- "Wishes Wall" → "Tributes Wall"
- "wish" (standalone) → "tribute"; "wishes" → "tributes"
- Route `/wishes` → `/tributes`
- Mockup file `wishes-wall.html` → `tributes-wall.html`
- Apply this rename universally during implementation — no residual "wish" references should appear in UI text.

### Amendment 2 — Hero Biography (home.html)

The Celebration Intro section now contains the full biography from `docs/Pastor Olakiitan Olaleye Biography.docx` with a **Read More / Read Less** reveal pattern:
- Only the first 3–4 lines are visible on load
- A soft bottom fade-out gradient blends into the ivory background
- A gold "Read More ▼" link toggles full expansion via CSS `max-height` transition
- The biography text includes structured subheadings (Early Life, Professional, Family, Faith, Impact)
- **No JS frameworks needed** — vanilla `classList.toggle` handles the expand/collapse

### Amendment 3 — Bible Verse Section (home.html)

A new `<!-- ===== BIBLE VERSE ===== -->` section sits between "Recent Tributes" and "Event Details":
- Dark purple background (`#2D1048`) with a soft gold radial glow
- Isaiah 60:1 NLT displayed in Playfair Display italic, large and centred
- Reference line in small caps, gold, DM Sans
- Contemplatve pause — no CTA, no button

### Amendment 4 — "Laitan Throughout the Years" (home.html)

A new `<!-- ===== LAITAN THROUGH THE YEARS ===== -->` section sits between "Celebration Intro" and "How to Participate":
- 2×3 responsive grid of photo cards with dashed-gold placeholder borders
- Each card has a caption field below the image slot
- A centred gold CTA pill links to `/gallery#laitan-photos`
- **Admin-only content:** Photos and captions are uploaded exclusively via the admin dashboard (FR-006)

### Amendment 5 — Footer Text

All footer brand text changed from "Olakiitan at 50" → "Pastor Olakiitan Olaleye @ 50" across all 6 mockups.

### Amendment 6 — "Laitan's Photos" (gallery.html + admin.html)

The **Gallery page** now has **3 tabs** in the tab switcher bar:
1. **Videos** — tab (existing)
2. **Photos** — tab (existing)
3. **Laitan's Photos** — third tab, admin-curated, read-only for guests. Uses the same `switchGallery()` JS and `.gallery-panel` pattern as the other tabs. Icon: Heroicons camera.

There is **NO standalone section** below the tab area. The "Laitan's Photos" content panel lives inside the tab system as `id="gpanel-laitan"`.

The **Admin Dashboard** has a **"Laitan's Photos" management panel** below the submissions list:
- Upload button, photo grid with hover-reveal delete buttons, inline caption editing per photo
- This panel must be wired to the same storage bucket / DB table that feeds the "Laitan Throughout the Years" (home) and "Laitan's Photos" (gallery) public sections
- This is part of **FR-006** scope

