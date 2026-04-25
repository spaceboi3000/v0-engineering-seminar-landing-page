# Landing Page Components

All landing page components are in `components/`. They are composed together in `app/page.tsx`.

## Header (`header.tsx`)

Sticky navigation bar with:

- RoboTalk logo (robot PNG + gradient text)
- Navigation links: Home, About, Speakers, Gallery, Sponsors, Location, Contact
- Mobile hamburger menu (slide-in from right)
- Auth-aware buttons: Login/Register or Logout
- `suppressHydrationWarning` for auth state mismatch prevention

**Key behavior:** Auth state is detected via `supabase.auth.getSession()` on the client side. The header switches between Login/Register and Dashboard/Logout buttons accordingly.

## Hero (`hero.tsx`)

Full-screen hero section with:

- Background image with overlay
- Animated gradient orbs (red + blue) with CSS keyframe animations
- Grid pattern overlay for depth
- Floating RoboTalk robot logo with glow shadow
- Event subtitle: "A Robotics & AI Event"
- CTA button linking to registration
- Styled-jsx `float` keyframe for logo animation

**Note:** Uses `"use client"` for the CSS animation.

## About (`about.tsx`)

Event description section with:

- Split layout: text left, image right
- Venue: Goethe-Institut Athen
- Date: April 25, 2026
- Three highlight bullets: Keynote Speakers, Interactive Workshops, Networking
- Goethe Institute image

## Speakers (`speakers.tsx`)

Speaker showcase grid:

- Cards with photo, name, title
- Links to individual speaker pages at `/speakers/[id]`
- Data sourced from `data/speakers.ts`
- Each speaker detail page has bio, title, social links

**Data file:** `data/speakers.ts` exports a `Speaker` interface and array.

## Sponsors (`sponsors.tsx`)

Tiered sponsor display:

- Four tiers: Platinum, Gold, Silver, Bronze
- Each tier has a metallic gradient color scheme defined in `data/sponsors.ts` (`TIER_CONFIG`)
- Sponsor cards with logo, short description
- Links to individual sponsor pages at `/sponsors/[id]`

**Data file:** `data/sponsors.ts` exports a `Sponsor` interface, `TIER_CONFIG` with gradient styles, and sponsor array.

**Tier colors (current):**

- Platinum: `#a0b2c6` (cool steel blue)
- Gold: `#c9a84c` (warm gold)
- Silver: `#8e9bae` (silver gray)
- Bronze: `#a06b3e` (warm bronze)

## Past Events / Gallery (`past-events.tsx`)

Image gallery with:

- Section title: "Gallery"
- Touch swipe support for mobile carousel
- Images from `public/past_events/` directory (webp format)
- Images from previous RoboTalk events (2023, 2024, 2025)

## Location (`location.tsx`)

Event venue information:

- Goethe-Institut Athen address and details
- Embedded map or location visual

## Organizers (`organizers.tsx`)

IEEE RAS NTUA team section:

- Team member cards with photos and roles
- Leadership and organizing committee

## Contact (`contact.tsx`)

Contact form:

- Fields: name, email, message
- Submits to `/api/contact` endpoint
- Tech grid background pattern
- `suppressHydrationWarning` attribute
- Sends email to team + confirmation to sender

## Footer (`footer.tsx`)

Site footer with:

- RoboTalk logo (robot PNG + gradient text)
- Navigation links matching the header
- Copyright notice: "2026 IEEE RAS NTUA"
- Links: Home, About, Speakers, Gallery, Sponsors, Location, Contact

## Supporting Components

### `section-divider.tsx`

Visual separator between landing page sections with gradient styling.

### `newsletter.tsx`

Newsletter subscription form with email input. Submits to `/api/subscribe`, triggers email confirmation flow.

### `confirmation-toast.tsx`

Reads `?confirmed=true|invalid|already` query param and shows a toast notification for newsletter confirmation status. Uses `sonner` toast library.
