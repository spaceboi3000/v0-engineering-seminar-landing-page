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

**Schedule structure:**

- Events with `conflict_group = NULL` are displayed full-width (standalone)
- Events sharing the same `conflict_group` are displayed side-by-side
- Events with `group_label` are group-assigned (A/B highlighting, no enrollment)
- Events without `group_label` but with `conflict_group` are enrollable (subscribe button)

**Migration:** `20260414000000_create_workshops.sql`, `20260415000000_workshops_capacity_waitlist.sql`, `20260418000000_new_schedule_data.sql`

---

### `enrollments`

Tracks which users are enrolled in which workshops.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid (FK → auth.users) | The enrolled user |
| `workshop_id` | text (FK → workshops) | The workshop |
| `enrolled_at` | timestamptz | When the enrollment was created |
| `status` | text | `'enrolled'` or `'waitlisted'` |

**Constraints:**

- `UNIQUE (user_id, workshop_id)` - A user can only enroll once per workshop
- `CHECK (status IN ('enrolled', 'waitlisted'))`

**RLS Policies:**

- Users can view their own enrollments
- Users can insert their own enrollments
- Users can delete their own enrollments

**Migration:** `20260414000000_create_workshops.sql`, `20260415000000_workshops_capacity_waitlist.sql`

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

## Entity Relationship

```
auth.users
  │
  ├──1:1──► profiles (id = auth.users.id)
  │           └── assigned_group (A / B / Not set / Admin)
  │
  └──1:N──► enrollments
              │   └── status (enrolled / waitlisted)
              │
              └──N:1──► workshops
                          ├── group_label (A / B / null)
                          └── conflict_group (slot grouping)

subscribers (standalone, no FK)

cvs bucket (keyed by user_id path)
```
