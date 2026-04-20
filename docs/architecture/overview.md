# Architecture Overview

## Application Layers

The project has three distinct layers:

### 1. Public Landing Page (`/`)

A marketing site composed of server-rendered sections. Each section is a standalone React component in `components/`:

```
page.tsx (app/page.tsx)
  ├── Header         ← Sticky nav with auth-aware login/logout
  ├── Hero           ← Animated background, event CTA
  ├── About          ← Event description, venue info
  ├── Speakers       ← Grid of speaker cards → /speakers/[id]
  ├── PastEvents     ← Gallery with touch swipe support
  ├── Sponsors       ← Tiered sponsor grid → /sponsors/[id]
  ├── Organizers     ← Team member cards
  ├── Location       ← Venue info + embedded map
  ├── Contact        ← Contact form → /api/contact
  └── Footer         ← Nav links, copyright
```

### 2. Auth Flow (`/register`, `/login`)

```
/register → Supabase Auth signup → confirmation email → /api/register (profile creation)
/login    → Supabase Auth signin → redirect to /dashboard
```

- Registration creates a Supabase Auth user, then the `/api/register` route creates a `profiles` row
- The service role key is used in `/api/register` to bypass RLS for profile insertion
- Email confirmation is handled by Supabase Auth's built-in flow

### 3. Attendee Dashboard (`/dashboard`)

A protected page that requires authentication. Server component fetches all data, passes to client components:

```
dashboard/page.tsx (Server Component)
  │
  ├── Fetches: profile, enrollments, enrollment counts, workshops
  │
  ├── UserHeader          ← Name, group badge, settings modal (profile edit, CV upload)
  ├── QrCheckinCard       ← QR code with attendee ID for event check-in
  ├── ScheduleTimeline    ← Full schedule with enrollment system
  ├── GameSection         ← Snake game with scoring
  ├── BottomNav           ← Mobile navigation
  └── WinOverlay          ← Game achievement celebration
```

## Data Flow

### Server-Side (Page Load)

```
Browser → Next.js Server Component
  → createSupabaseServer() (cookie-based session)
  → Fetch profile, enrollments, workshops from Supabase
  → Render HTML with data
  → Send to browser
```

### Client-Side (Enrollment)

```
User clicks "Subscribe"
  → Client gets auth token via createSupabaseBrowser()
  → POST /api/enroll with Bearer token
  → API validates user, checks time conflicts, checks capacity
  → Insert enrollment row (enrolled or waitlisted)
  → Client updates local state optimistically
```

## Supabase Clients

The project uses three different Supabase client factories:

| File | Context | Auth | Used By |
|------|---------|------|---------|
| `lib/supabase.ts` | Server (API routes) | Service role key | `/api/enroll`, `/api/register` |
| `lib/supabase-server.ts` | Server Components | Cookie session | `dashboard/page.tsx` |
| `lib/supabase-browser.ts` | Client Components | Anon key + session | `user-header.tsx`, `schedule-timeline.tsx` |

!!! warning "Service Role Key"
    The `lib/supabase.ts` client uses the **service role key** which bypasses all RLS policies.
    Only use this in server-side API routes, never expose it to the client.

## Component Library

UI primitives come from [shadcn/ui](https://ui.shadcn.com/) in `components/ui/`. These are copy-pasted components (not an npm dependency) that can be customized directly.

Key primitives used: `Avatar`, `Badge`, `Button`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Toast`.

## Styling

- **Tailwind CSS** with custom theme tokens defined in `tailwind.config.ts`
- Brand colors: `ras-red`, `ieee-blue`, `ieee-cyan`
- Dark mode enabled by default (slate scheme)
- All custom animations in the Tailwind config (accordion, float effects)

## Session Management

The `proxy.ts` middleware refreshes Supabase sessions on each request by reading/writing cookies. This prevents session expiration during extended browsing.
