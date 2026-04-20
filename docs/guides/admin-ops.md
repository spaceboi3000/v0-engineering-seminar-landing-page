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

## Group Assignment

### How Groups Work

The `assigned_group` column in `profiles` determines which events are highlighted for each user in the dashboard schedule.

| Value | Behavior |
|-------|----------|
| `Not set` | No group highlighting, "No group" badge |
| `A` | Group A events highlighted with blue glow |
| `B` | Group B events highlighted with blue glow |

### Assign a User to a Group

**Supabase Dashboard:**

1. Go to Table Editor > `profiles`
2. Find the user's row
3. Click the `assigned_group` cell
4. Select from the dropdown: `Not set`, `A`, or `B`

The CHECK constraint ensures only valid values can be set.

**SQL:**

```sql
-- Assign a single user
UPDATE profiles SET assigned_group = 'A' WHERE id = 'user-uuid-here';

-- Assign all users from a university to group A
UPDATE profiles SET assigned_group = 'A' WHERE university ILIKE '%NTUA%';

-- Reset all groups
UPDATE profiles SET assigned_group = 'Not set';
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

### Promote Waitlisted Users

When an enrolled user drops out, promote the earliest waitlisted user:

```sql
UPDATE enrollments
SET status = 'enrolled'
WHERE id = (
  SELECT id FROM enrollments
  WHERE workshop_id = 'renesas' AND status = 'waitlisted'
  ORDER BY enrolled_at ASC
  LIMIT 1
);
```

### Export Enrollment Data

```bash
echo "SELECT p.first_name, p.last_name, p.email, p.university, p.department,
       w.title as workshop, e.status
FROM enrollments e
JOIN profiles p ON e.user_id = p.id
JOIN workshops w ON e.workshop_id = w.id
ORDER BY w.title, e.status, p.last_name;" | npx supabase db query --linked --csv
```

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
