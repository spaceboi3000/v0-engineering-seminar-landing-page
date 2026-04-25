# Adapting for Future Events

This guide explains how to reuse the platform for RoboTalk 2027, 2028, etc. with minimal code changes.

## Checklist

- [ ] Update event metadata (name, date, venue)
- [ ] Update schedule data in Supabase
- [ ] Update speaker data
- [ ] Update sponsor data
- [ ] Update gallery images
- [ ] Update organizer info
- [ ] Reset user data (optional: fresh Supabase project)
- [ ] Update deployment config

## 1. Event Metadata

### Date and Name

Update these locations:

**`app/dashboard/page.tsx`** (lines ~62-63):

```typescript
eventName="RoboTalk 2027"
date="April XX, 2027"
```

**`components/about.tsx`**: Update venue, date, description text.

**`components/hero.tsx`**: Update subtitle and CTA text if needed.

**`app/layout.tsx`**: Update metadata title and description:

```typescript
export const metadata: Metadata = {
  title: "RoboTalk 2027 | IEEE RAS NTUA",
  description: "...",
}
```

**`components/footer.tsx`**: Update copyright year:

```
2027 IEEE RAS NTUA
```

### Profile Edit Deadline

In `components/dashboard/user-header.tsx`, update the edit lock date:

```typescript
const EDIT_DEADLINE = new Date("2027-04-XX T23:59:59")
```

## 2. Schedule Data

The schedule is stored entirely in Supabase. To update it:

### Option A: SQL Migration

Create a new migration file (e.g., `20270401000000_robotalk_2027_schedule.sql`):

```sql
-- Clear old data
DELETE FROM public.enrollments;
DELETE FROM public.workshops;

-- Insert new schedule
INSERT INTO public.workshops (id, title, speaker, location, type,
  start_time, end_time, capacity, group_label, conflict_group) VALUES
  ('welcome-2027', 'Welcome & Registration', NULL, 'Foyer', 'break',
   '2027-04-XX 09:00:00+03', '2027-04-XX 09:30:00+03', 9999, NULL, NULL),
  -- ... more events
;
```

### Option B: Supabase Dashboard

1. Go to Table Editor > `workshops`
2. Delete all rows
3. Insert new rows via the UI

### Schedule Structure Reference

| Column | Values | Purpose |
|--------|--------|---------|
| `type` | `workshop`, `seminar`, `break`, `networking` | Determines icon and color |
| `capacity` | number | `9999` = unlimited, real number = tracked |
| `group_label` | `'A'`, `'B'`, or `NULL` | Group assignment for conflicts |
| `conflict_group` | shared string or `NULL` | Groups events displayed side-by-side |

**To create a group A/B conflict:**

```sql
-- Both events share the same conflict_group and have group_labels
('coffee-a', 'Coffee break', NULL, 'First Floor', 'break',
 '2027-04-XX 11:30:00+03', '2027-04-XX 11:50:00+03', 9999, 'A', 'slot-1'),
('talk-b', 'Team Presentation', NULL, 'Amphitheatre', 'seminar',
 '2027-04-XX 11:30:00+03', '2027-04-XX 11:50:00+03', 9999, 'B', 'slot-1'),
```

**To create an enrollable conflict (choose-one workshops):**

```sql
-- Same conflict_group, NULL group_label, real capacity
('ws-room1', 'Workshop A', NULL, 'Room 1', 'workshop',
 '2027-04-XX 15:00:00+03', '2027-04-XX 16:30:00+03', 50, NULL, 'slot-2'),
('ws-room2', 'Workshop B', NULL, 'Room 2', 'workshop',
 '2027-04-XX 15:00:00+03', '2027-04-XX 16:30:00+03', 40, NULL, 'slot-2'),
```

**To create a spanning event (one workshop overlapping multiple talks):**

```sql
-- Three events share conflict_group, workshop has wider time range
('talk-1', 'Speaker A', NULL, 'Amphitheatre', 'seminar',
 '2027-04-XX 16:00:00+03', '2027-04-XX 16:30:00+03', 9999, NULL, 'slot-3'),
('long-ws', 'Long Workshop', NULL, 'Room 1', 'workshop',
 '2027-04-XX 16:00:00+03', '2027-04-XX 17:00:00+03', 30, NULL, 'slot-3'),
('talk-2', 'Speaker B', NULL, 'Amphitheatre', 'seminar',
 '2027-04-XX 16:30:00+03', '2027-04-XX 17:00:00+03', 9999, NULL, 'slot-3'),
```

## 3. Speaker Data

Edit `data/speakers.ts`:

```typescript
export const speakers: Speaker[] = [
  {
    id: "speaker-slug",
    name: "Full Name",
    title: "Title / Organization",
    photo: "/images/speakers/photo.webp",
    bio: "Speaker biography...",
    links: {
      linkedin: "https://linkedin.com/in/...",
      website: "https://..."
    }
  },
  // ... more speakers
]
```

Add speaker photos to `public/images/speakers/` (webp format recommended).

## 4. Sponsor Data

Edit `data/sponsors.ts`:

```typescript
export const sponsors: Sponsor[] = [
  {
    id: "sponsor-slug",
    name: "Company Name",
    tier: "platinum", // platinum | gold | silver | bronze
    logo: "/images/sponsors/logo.webp",
    shortDescription: "Brief tagline",
    longDescription: "Full description for detail page...",
    website: "https://...",
    email: "contact@company.com",
    social: {
      linkedin: "https://...",
      instagram: "https://..."
    }
  },
]
```

To update tier colors, modify `TIER_CONFIG` in the same file:

```typescript
export const TIER_CONFIG = {
  platinum: {
    gradient: "linear-gradient(135deg, #a0b2c6, #7a8fa6)",
    textColor: "#a0b2c6",
    // ...
  },
  // ... other tiers
}
```

## 5. Gallery Images

Replace images in `public/past_events/` with new event photos:

```
public/past_events/
  ├── 2026rob1.webp
  ├── 2026rob2.webp
  └── ...
```

Update `components/past-events.tsx` to reference the new filenames.

Also update hero/about background images in `public/images/` if needed.

## 6. Organizer Info

Update `components/organizers.tsx` with new team members, photos, and roles.

## 7. Fresh Start (Optional)

For a completely fresh database:

1. Create a new Supabase project
2. Apply all migrations
3. Update `.env.local` with new project credentials
4. All users will need to re-register

Or, to keep the same project but clean user data:

```sql
-- WARNING: Deletes all user data
DELETE FROM public.enrollments;
DELETE FROM public.profiles;
-- Delete auth users via Supabase dashboard or admin API
```

## 8. Timezone

All schedule times use Athens timezone (`Europe/Athens`, UTC+3 in summer / UTC+2 in winter). The frontend formats times using:

```typescript
new Date(iso).toLocaleTimeString("el-GR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Athens"
})
```

If the event moves to a different timezone, update this in `schedule-timeline.tsx`.
