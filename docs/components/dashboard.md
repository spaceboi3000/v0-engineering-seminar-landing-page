# Dashboard Components

The attendee dashboard is a protected page at `/dashboard`. All dashboard components are in `components/dashboard/`.

## Page Structure (`app/dashboard/page.tsx`)

Server component that:

1. Checks authentication (redirects to `/login` if not logged in)
2. Fetches user profile (name, university, department, assigned group)
3. Fetches enrollment data (enrolled workshops, waitlisted workshops)
4. Fetches enrollment counts (for capacity display)
5. Fetches all workshops (with group_label and conflict_group)
6. Passes everything as props to client components

## UserHeader (`user-header.tsx`)

Displays user info and provides settings access.

**Features:**

- Avatar with initials and red gradient background
- "Welcome back, {Name}" greeting
- Event info card: "RoboTalk 2026 / April 25, 2026"
- Group badge: Shows "Group A" or "Group B" (red gradient) when assigned, or "No group" (muted) when unset
- Settings gear button opening a modal

**Settings Modal (built into UserHeader):**

Two tabs:

1. **Profile tab** - Edit first name, last name, university, department. Locked after event date (April 26).
2. **CV tab** - Upload PDF resume (max 5MB) to Supabase Storage. Link to CV template page. Check existing upload.

**Props:**

```typescript
interface UserHeaderProps {
  name: string
  group: string          // 'A', 'B', or 'Not set'
  eventName: string
  date: string
  userId: string
  firstName: string
  lastName: string
  university: string
  department: string
}
```

## ScheduleTimeline (`schedule-timeline.tsx`)

The most complex dashboard component. Displays the full event schedule with enrollment.

### Schedule Row Types

The component processes events from the database into four distinct row types:

| Row Type | Display | Enrollment |
|----------|---------|------------|
| `single` | Full-width card | No |
| `group-conflict` | Two cards side-by-side | No (group determines) |
| `enrollable-conflict` | Two cards side-by-side | Yes (subscribe buttons on workshops) |
| `spanning-conflict` | Stacked left + spanning right card | Yes (single enrollment for spanning event) |

### Grouping Algorithm

```
1. Group events by conflict_group column
2. Events with conflict_group = null → "single" rows
3. Groups where ALL events have group_label → "group-conflict"
4. Groups with different time boundaries → "spanning-conflict" (Renesas case)
5. Other groups → "enrollable-conflict"
6. Sort all rows chronologically
```

### Group Conflict Display

For events split by group A/B (coffee breaks, lunches):

- Both options displayed side-by-side in a 2-column grid
- The card matching the user's `assigned_group` is highlighted with a blue border/glow
- A "Group A/B - You" badge appears on the highlighted card
- No enrollment buttons (group assignment determines attendance)

### Enrollable Conflict Display

For workshops that compete for the same time slot (iRASional vs aeRAS):

- Both options displayed side-by-side
- Each workshop card shows capacity pill: `12/50 spots`
- Subscribe/Unsubscribe/Waitlist buttons on workshop-type events
- Seminar-type events in the conflict show info only (no button)

### Spanning Conflict (Renesas Case)

The Renesas Embedded workshop spans 17:10-18:10, overlapping with two consecutive talks:

```
┌─────────────────┬──────────────────┐
│ Eve Psalti      │ Embedded         │
│ 17:10 - 17:40   │ workshop         │
├─────────────────┤ (Renesas)        │
│ Haris Ioannou   │ 17:10 - 18:10   │
│ 17:40 - 18:10   │ [Subscribe]      │
└─────────────────┴──────────────────┘
```

Algorithm detects different time boundaries in the conflict group and splits into sub-rows. The workshop card appears on the right spanning both rows with a single enrollment button.

### Enrollment Flow

```
User clicks "Subscribe" on a workshop card
  → handleEnroll(workshopId)
  → Gets auth token from browser session
  → POST /api/enroll with workshopId
  → API checks time conflicts with existing enrollments
  → API checks capacity
  → Returns: enrolled, waitlisted, or error
  → Client updates state (optimistic UI)
  → Immediate refresh from server to sync truth
```

**Time conflict example:** If enrolled in Renesas (17:10-18:10), the API blocks enrollment in Eve Psalti (17:10-17:40) because their times overlap.

### Unenroll & Waitlist Promotion

```
User clicks "Unsubscribe"
  → DELETE /api/enroll with workshopId
  → API checks if user was enrolled (not just waitlisted)
  → If enrolled: auto-promotes earliest waitlisted user to enrolled
  → Client updates state + immediate server refresh
```

The promoted user's dashboard updates automatically via polling (see below).

### Real-Time Polling

The schedule timeline polls Supabase every **15 seconds** to refresh:

- The current user's enrollment statuses (enrolled vs waitlisted)
- Global enrollment counts per workshop

This ensures:

- If you get promoted from the waitlist, your status badge updates automatically
- Spot availability stays current across all users
- After any enroll/unenroll action, an immediate refresh is triggered (no 15s wait)

### Workshop Instructions

Workshops can have instruction PDFs uploaded by admins. When instructions exist:

- An "Instructions" button appears on the **right side** of workshop cards in the timeline
- The detail popup shows a "Download Instructions (PDF)" link below the description
- PDFs are served through `/api/workshop-instructions?id=...` (proxy hides Supabase URL)
- The client only knows `hasInstructions: boolean`, never the storage URL

### Event Detail Popup

Tapping a card with a description opens a centered modal:

- Max width: `max-w-3xl`, max height: `85vh`
- Shows event icon, title, speaker, time, location
- Full description text with `whitespace-pre-line`
- Instructions download link below a separator (if available)

### Filter Tabs

Three filter options: All, Seminars, Workshops.

- Filters apply at the row level
- A conflict row is shown if ANY event in it matches the filter
- Both sides of a conflict are always shown together

### Props

```typescript
interface Props {
  userId: string
  assignedGroup: string    // 'A', 'B', or 'Not set'
  enrolledIds: string[]
  waitlistedIds: string[]
  enrollmentCounts: Record<string, number>
  workshops: WorkshopRow[]
}
```

## QrCheckinCard (`qr-checkin-card.tsx`)

Generates a QR code for event check-in.

- Displays attendee ID: `RAS-{first 8 chars of UUID}`
- QR code contains the user ID for scanning at the event entrance
- Uses `qrcode.react` library

## BottomNav (`bottom-nav.tsx`)

Mobile-only bottom navigation bar with icons for:

- QR Code section
- Schedule section
- Game section

Uses smooth scrolling to navigate between dashboard sections.

## GameSection (`game-section.tsx`)

Container for the embedded Snake game. Always visible below the schedule on both mobile and desktop.

- Wraps the SnakeGame component
- Provides scoring context
- No conditional show/hide — renders immediately for all logged-in users

## SnakeGame (`snake-game.tsx`)

Playable Snake game built with HTML Canvas.

- Touch and keyboard controls
- Collision detection
- Score tracking with local high score
- Canvas-based rendering

## GameButton (`game-button.tsx`)

Desktop button to toggle the game section visibility. Appears in the sidebar area on large screens.

## WinOverlay (`winoverlay.tsx`)

Celebratory overlay that appears when the user achieves a high score in the Snake game. Shows confetti/animation effects.

## SidebarNav (`sidebar-nav.tsx`)

Desktop sidebar navigation (currently not imported in the dashboard page but available). Red theme styling with collapsible menu items.
