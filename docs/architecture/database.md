# Database Schema

The database runs on **Supabase** (PostgreSQL). All tables use **Row Level Security (RLS)**.

## Tables

### `profiles`

Stores user profile information, linked to Supabase Auth users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK, FK → auth.users) | User ID from Supabase Auth |
| `first_name` | text | User's first name |
| `last_name` | text | User's last name |
| `university` | text | University name |
| `department` | text | Department/school |
| `year` | text | Year of study (CHECK constraint for valid values) |
| `assigned_group` | text | Group assignment: `'Not set'`, `'A'`, `'B'`, or `'Admin'` (default: `'Not set'`) |

**RLS Policies:**

- Users can read their own profile
- Users can update their own profile
- Profile creation uses service role key (bypasses RLS)

**Migration:** `20260316000001_create_profiles.sql`, `20260417000000_add_group_to_profiles.sql`

---

### `workshops`

Stores all schedule events (seminars, workshops, breaks).

| Column | Type | Description |
|--------|------|-------------|
| `id` | text (PK) | Human-readable ID (e.g., `'renesas'`, `'coffee-a'`) |
| `title` | text | Event title |
| `speaker` | text (nullable) | Speaker name |
| `location` | text | Venue location |
| `type` | text | One of: `'workshop'`, `'seminar'`, `'break'`, `'networking'` |
| `start_time` | timestamptz | Event start time |
| `end_time` | timestamptz | Event end time |
| `capacity` | integer | Max enrollment (9999 for unlimited) |
| `group_label` | text (nullable) | Group assignment: `'A'` or `'B'` (null = open to all) |
| `conflict_group` | text (nullable) | Shared key for events displayed side-by-side (null = standalone) |
| `description` | text (nullable) | Event description shown in detail popup |
| `instructions_url` | text (nullable) | URL of uploaded instructions PDF (set by admin, served via proxy) |

**Schedule structure:**

- Events with `conflict_group = NULL` are displayed full-width (standalone)
- Events sharing the same `conflict_group` are displayed side-by-side
- Events with `group_label` are group-assigned (A/B highlighting, no enrollment)
- Events without `group_label` but with `conflict_group` are enrollable (subscribe button)

**Migration:** `20260414000000_create_workshops.sql`, `20260415000000_workshops_capacity_waitlist.sql`, `20260418000000_new_schedule_data.sql`, `20260421000000_add_descriptions_update_titles.sql`, `20260424100000_workshop_instructions_pdf.sql`

---

### `enrollments`

Tracks which users are enrolled in which workshops.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid (FK → auth.users) | The enrolled user |
| `workshop_id` | text (FK → workshops) | The workshop |
| `enrolled_at` | timestamptz | When the enrollment was created |
| `status` | text | `'enrolled'`, `'waitlisted'`, or `'pending_cancel'` |
| `cancel_at` | timestamptz (nullable) | When a pending_cancel should be committed |

**Constraints:**

- `UNIQUE (user_id, workshop_id)` - A user can only enroll once per workshop
- `CHECK (status IN ('enrolled', 'waitlisted', 'pending_cancel'))`

**Graceful unenroll:** When an enrolled user unsubscribes, the status is set to `pending_cancel` with `cancel_at = now + 60s`. If they re-subscribe within 60 seconds, the status reverts to `enrolled` (position preserved). After expiry, a pg_cron job deletes the row and promotes the next waitlisted user.

**RLS Policies:**

- Users can view their own enrollments
- Users can insert their own enrollments
- Users can delete their own enrollments

**Migration:** `20260414000000_create_workshops.sql`, `20260415000000_workshops_capacity_waitlist.sql`, `20260425000000_graceful_unenroll.sql`

---

### `check_ins`

Tracks physical attendance per context (entrance or workshop).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid (FK → auth.users) | The checked-in user |
| `context` | text | `'entrance'` or a workshop_id |
| `checked_at` | timestamptz | When the check-in was recorded |
| `checked_by` | uuid (FK → auth.users, nullable) | Admin who scanned |

**Constraints:**

- `UNIQUE (user_id, context)` - One check-in per context per user

**Migration:** `20260425100000_check_ins.sql`

---

### `subscribers`

Stores newsletter email subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| `email` | text (unique) | Subscriber email |
| `token` | text | Confirmation token |
| `confirmed` | boolean | Whether email is confirmed |
| `subscribed_at` | timestamptz | Subscription timestamp |
| `confirmed_at` | timestamptz (nullable) | Confirmation timestamp |

**Migration:** `20260316000000_create_subscribers.sql`

---

## Views

### `workshop_enrollment_summary`

Public read-only view aggregating enrollment counts per workshop.

| Column | Type | Description |
|--------|------|-------------|
| `workshop_id` | text | Workshop ID |
| `enrolled_count` | bigint | Number of enrolled users |
| `waitlisted_count` | bigint | Number of waitlisted users |

Accessible by `authenticated` and `anon` roles (no user data exposed).

**Migration:** `20260415000000_workshops_capacity_waitlist.sql`

---

## Storage

### `cvs` Bucket

Private storage bucket for user CV uploads.

- Path format: `{user_id}/cv.pdf`
- Max file: 5MB, PDF only
- RLS: Users can only read/write/delete their own files
- Access via signed URLs (time-limited)

**Migration:** `20260316000002_create_cv_storage.sql`

### `workshop-instructions` Bucket

Public storage bucket for workshop instruction PDFs uploaded by admins.

- Path format: `{workshop_id}/instructions.pdf`
- Managed via the admin panel's Instructions tab
- Served to users through the `/api/workshop-instructions` proxy (hides Supabase URL)
- The workshop's `instructions_url` column stores the raw storage URL (never exposed to clients)

**Migration:** `20260424100000_workshop_instructions_pdf.sql`

---

## Migration Files

Applied in chronological order:

| File | Description |
|------|-------------|
| `20260316000000_create_subscribers.sql` | Newsletter subscribers table |
| `20260316000001_create_profiles.sql` | User profiles with RLS |
| `20260316000002_create_cv_storage.sql` | CV storage bucket + policies |
| `20260414000000_create_workshops.sql` | Workshops + enrollments tables |
| `20260415000000_workshops_capacity_waitlist.sql` | Capacity, waitlist status, enrollment summary view |
| `20260417000000_add_group_to_profiles.sql` | Group assignment column (A/B/Not set) |
| `20260418000000_new_schedule_data.sql` | Real schedule data + group_label/conflict_group columns |
| `20260420000000_create_cv_uploads.sql` | CV uploads tracking table |
| `20260420000001_update_schedule.sql` | Schedule data updates |
| `20260421000000_add_descriptions_update_titles.sql` | Event descriptions + title updates |
| `20260421100000_add_company_registration.sql` | Company registration support |
| `20260422000000_fix_cv_uploads_rls.sql` | Fix CV uploads RLS policies |
| `20260424000000_cleanup_unconfirmed_accounts.sql` | pg_cron job: auto-delete unconfirmed accounts hourly |
| `20260424100000_workshop_instructions_pdf.sql` | `instructions_url` column + `workshop-instructions` bucket |
| `20260425000000_graceful_unenroll.sql` | `pending_cancel` status, `cancel_at` column, pg_cron processor |
| `20260425100000_check_ins.sql` | Physical attendance tracking table |

## Entity Relationship

```
auth.users
  │
  ├──1:1──► profiles (id = auth.users.id)
  │           └── assigned_group (A / B / Not set / Admin)
  │
  ├──1:N──► enrollments
  │           │   └── status (enrolled / waitlisted / pending_cancel)
  │           │   └── cancel_at (graceful unenroll timer)
  │           │
  │           └──N:1──► workshops
  │                       ├── group_label (A / B / null)
  │                       └── conflict_group (slot grouping)
  │
  └──1:N──► check_ins
              ├── context ('entrance' or workshop_id)
              └── checked_by (admin who scanned)

subscribers (standalone, no FK)

cvs bucket (keyed by user_id path)
```
