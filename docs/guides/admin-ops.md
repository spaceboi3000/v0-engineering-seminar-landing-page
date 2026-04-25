# Admin Operations

This guide covers common administrative tasks performed via the Supabase dashboard or CLI.

## User Management

### View All Users

**Supabase Dashboard:** Authentication > Users

**CLI:**

```bash
echo "SELECT id, email, email_confirmed_at FROM auth.users ORDER BY created_at DESC;" \
  | npx supabase db query --linked
```

### Confirm a User's Email

If a user can't find their confirmation email:

**Supabase Dashboard:** Authentication > Users > Click user > Actions > Confirm email

**API (Node.js):**

```typescript
const supabase = getSupabase() // service role client
await supabase.auth.admin.updateUserById(userId, {
  email_confirm: true
})
```

### View User Profiles

```bash
echo "SELECT id, first_name, last_name, university, assigned_group FROM profiles;" \
  | npx supabase db query --linked
```

## Admin Check-in Page

The admin check-in page (`/admin`) provides on-site event management with three tabs: **Scan**, **Attendance**, and **Instructions**.

### Prerequisites

1. The admin user must have `assigned_group = 'Admin'` in the `profiles` table
2. The `profiles_assigned_group_check` constraint must include `'Admin'` as a valid value:

```sql
ALTER TABLE profiles DROP CONSTRAINT profiles_assigned_group_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_assigned_group_check
  CHECK (assigned_group IN ('A', 'B', 'Not set', 'Admin'));
```

3. Set the admin's group in the Supabase dashboard or via SQL:

```sql
UPDATE profiles SET assigned_group = 'Admin' WHERE id = 'your-user-uuid';
```

### Scan Tab

The Scan tab has a **context selector** dropdown at the top with options:
- **Entrance** — for entrance check-in and group assignment
- **Each workshop** — listed by title and start time

**Entrance mode:**

1. Select "Entrance" from the dropdown
2. Tap **Scan QR Code** → point camera at attendee's QR
3. The scanned user's profile appears with enrollments and check-in badges
4. Tap **Group A** or **Group B** to assign the user
5. Tap **Record Check-in** to log their entrance attendance
6. A small **Promote to Admin** button appears below the group buttons (with confirmation)

**Workshop mode:**

1. Select a workshop from the dropdown
2. Scan a QR code — the user's enrollment status for that workshop is shown:
   - **Enrolled** → tap "Record Check-in" to log workshop attendance
   - **Waitlisted** → a **Promote (bump latest no-show)** button appears. This removes the most recently enrolled person who hasn't been scanned for this workshop and gives their spot to the waitlisted user
   - **Not enrolled** → warning message shown
   - **Pending cancel** → automatically reverted to enrolled on check-in

### Attendance Tab

Shows a live list of all users who checked in for a selected context:

1. Select context from dropdown (Entrance or any workshop)
2. See count badge and list of attendees with name, university, group, and check-in time
3. Auto-refreshes every 10 seconds
4. **CSV export** button downloads the attendance list

### Instructions Tab

Same as before — upload/remove instruction PDFs per workshop.

### Access Control

- Non-logged-in users are redirected to `/login`
- Logged-in users without `assigned_group = 'Admin'` are redirected to `/dashboard`
- All admin API routes independently verify admin status server-side

### QR Code Format

The attendee QR codes displayed on the dashboard follow this format:

```
ras-ntua:checkin:{userId}
```

Where `{userId}` is the Supabase Auth user UUID. The scanner parses this and looks up the user via the `/api/admin/lookup` endpoint.

---

## Group Assignment

### How Groups Work

The `assigned_group` column in `profiles` determines which events are highlighted for each user in the dashboard schedule.

| Value | Behavior |
|-------|----------|
| `Not set` | No group highlighting, "No group" badge |
| `A` | Group A events highlighted with blue glow |
| `B` | Group B events highlighted with blue glow |
| `Admin` | Admin access to `/admin` check-in page |

### Assign a User to a Group

**Admin check-in page (recommended for on-site):**

Navigate to `/admin`, scan the attendee's QR code, and tap Group A or Group B.

**Supabase Dashboard:**

1. Go to Table Editor > `profiles`
2. Find the user's row
3. Click the `assigned_group` cell
4. Select from the dropdown: `Not set`, `A`, `B`, or `Admin`

The CHECK constraint ensures only valid values can be set.

**SQL:**

```sql
-- Assign a single user
UPDATE profiles SET assigned_group = 'A' WHERE id = 'user-uuid-here';

-- Assign all users from a university to group A
UPDATE profiles SET assigned_group = 'A' WHERE university ILIKE '%NTUA%';

-- Reset all groups (except admins)
UPDATE profiles SET assigned_group = 'Not set' WHERE assigned_group != 'Admin';
```

### Bulk Group Assignment

For assigning groups to many users at once:

```sql
-- Assign first half to A, second half to B (by registration order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn,
         COUNT(*) OVER () as total
  FROM profiles
  WHERE assigned_group = 'Not set'
)
UPDATE profiles SET assigned_group = CASE
  WHEN (SELECT rn FROM ranked WHERE ranked.id = profiles.id) <= (SELECT total/2 FROM ranked LIMIT 1) THEN 'A'
  ELSE 'B'
END
WHERE id IN (SELECT id FROM ranked);
```

## Schedule Management

### View Current Schedule

```bash
echo "SELECT id, title, type, start_time, end_time, capacity, group_label, conflict_group
FROM workshops ORDER BY start_time;" | npx supabase db query --linked
```

### Update a Workshop's Capacity

```sql
UPDATE workshops SET capacity = 60 WHERE id = 'irasional';
```

### Add a New Event

```sql
INSERT INTO workshops (id, title, speaker, location, type, start_time, end_time, capacity, group_label, conflict_group)
VALUES ('new-event', 'New Talk', 'Speaker Name', 'Amphitheatre', 'seminar',
        '2026-04-25 18:30:00+03', '2026-04-25 19:00:00+03', 9999, NULL, NULL);
```

### Remove an Event

```sql
-- This also cascades to delete related enrollments
DELETE FROM workshops WHERE id = 'event-id';
```

## Enrollment Management

### View All Enrollments

```bash
echo "SELECT e.workshop_id, w.title, e.status, COUNT(*) as count
FROM enrollments e JOIN workshops w ON e.workshop_id = w.id
GROUP BY e.workshop_id, w.title, e.status
ORDER BY w.title;" | npx supabase db query --linked
```

### View Enrollments for a Specific Workshop

```bash
echo "SELECT p.first_name, p.last_name, p.university, e.status, e.enrolled_at
FROM enrollments e
JOIN profiles p ON e.user_id = p.id
WHERE e.workshop_id = 'renesas'
ORDER BY e.enrolled_at;" | npx supabase db query --linked
```

### Waitlist Auto-Promotion

When an enrolled user unsubscribes, the system uses a **60-second grace period**:

1. The enrollment is marked `pending_cancel` with `cancel_at = now + 60s`
2. If the user re-subscribes within 60 seconds, their position is restored instantly
3. After 60 seconds, a pg_cron job (`process_pending_cancels`) deletes the enrollment and promotes the earliest waitlisted user

Waitlisted users who unsubscribe are deleted immediately (no grace period needed — they hold no spot).

The promoted user's dashboard updates within 15 seconds via polling.

### Admin Promote (Bump No-Shows)

On the admin `/admin` page in Workshop scan mode, when a waitlisted user is scanned:

1. The **Promote (bump latest no-show)** button appears
2. Pressing it finds the enrolled user who registered **last** and has **not been scanned** for that workshop
3. That user's enrollment is deleted, the waitlisted user is promoted to `enrolled`, and a workshop check-in is recorded
4. If all enrolled users have already checked in, the promote fails with a message

### Export Enrollment Data

```bash
echo "SELECT p.first_name, p.last_name, p.email, p.university, p.department,
       w.title as workshop, e.status
FROM enrollments e
JOIN profiles p ON e.user_id = p.id
JOIN workshops w ON e.workshop_id = w.id
ORDER BY w.title, e.status, p.last_name;" | npx supabase db query --linked --csv
```

## Workshop Instructions (PDF)

### Uploading Instructions

1. Navigate to `/admin` and click the **Instructions** tab
2. Each workshop is listed with an upload area
3. Click **Upload PDF** and select a PDF file
4. The file is stored in the `workshop-instructions` Supabase Storage bucket
5. A green "Uploaded" badge appears next to workshops that have instructions

### Removing Instructions

Click **Remove** next to a workshop with existing instructions. This deletes the file from storage and clears the `instructions_url` column.

### How Users See Instructions

- An "Instructions" button appears on workshop cards in the dashboard schedule
- The detail popup includes a "Download Instructions (PDF)" link
- The public schedule overview also shows an "Instructions (PDF)" link
- All links go through `/api/workshop-instructions?id=...` — the raw Supabase Storage URL is never exposed to clients

---

## CV Management

### Check if a User Uploaded a CV

CVs are stored in the `cvs` bucket at path `{user_id}/cv.pdf`.

**Supabase Dashboard:** Storage > cvs > Browse folders

### Download a User's CV

```typescript
const supabase = getSupabase()
const { data } = await supabase.storage
  .from('cvs')
  .createSignedUrl(`${userId}/cv.pdf`, 3600) // 1 hour URL
console.log(data.signedUrl)
```

## Newsletter Subscribers

### View Confirmed Subscribers

```bash
echo "SELECT email, confirmed_at FROM subscribers WHERE confirmed = true ORDER BY confirmed_at;" \
  | npx supabase db query --linked
```

### Export Subscriber Emails

```bash
echo "SELECT email FROM subscribers WHERE confirmed = true;" \
  | npx supabase db query --linked --csv
```

## Automated Cleanup

### Unconfirmed Account Deletion

A `pg_cron` job runs **every hour** and deletes Supabase Auth users that:

- Were created more than 24 hours ago
- Have never confirmed their email (`email_confirmed_at IS NULL`)

This prevents abandoned registrations from cluttering the database. The job cascades to delete related `profiles` and `enrollments` rows.

**Migration:** `20260424000000_cleanup_unconfirmed_accounts.sql`

**Check job status:**

```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Monitoring

### Check Service Status (Raspberry Pi)

```bash
sudo systemctl status nextjs
sudo systemctl status supabase
sudo journalctl -u nextjs -f  # live logs
```

### Check Auto-Deploy

```bash
sudo journalctl -u auto-deploy --since "1 hour ago"
```

## Troubleshooting

### User Can't Log In

1. Check if email is confirmed: Supabase Dashboard > Authentication > Users
2. If not confirmed, manually confirm the email
3. Check if profile exists in `profiles` table
4. If profile missing, create it manually:

```sql
INSERT INTO profiles (id, first_name, last_name, university, department, year)
VALUES ('user-uuid', 'First', 'Last', 'University', 'Department', '1st');
```

### Dashboard Shows Email Instead of Name

This means the profile row is missing. The user registered but the profile creation failed (usually a RLS issue). Create the profile manually as shown above.

### Workshop Shows Wrong Capacity

Update in Supabase Dashboard > Table Editor > workshops, or via SQL:

```sql
UPDATE workshops SET capacity = 50 WHERE id = 'workshop-id';
```
