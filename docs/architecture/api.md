# API Routes

All API routes are in `app/api/` and run server-side as Next.js Route Handlers.

## POST `/api/register`

Creates a user profile after email confirmation.

**Auth:** Service role key (bypasses RLS)

**Request body:**

```json
{
  "userId": "uuid",
  "firstName": "string",
  "lastName": "string",
  "university": "string",
  "department": "string",
  "year": "string"
}
```

**Response:** `{ success: true }` or `{ error: "message" }`

**Notes:**

- Called from the registration page after Supabase Auth creates the user
- Uses the service role key to insert into `profiles` table (bypasses RLS)
- The year field must match the CHECK constraint on the profiles table

---

## POST `/api/enroll`

Enrolls a user in a workshop.

**Auth:** Bearer token (user's Supabase session token)

**Request body:**

```json
{
  "workshopId": "string"
}
```

**Response:**

```json
{ "success": true, "waitlisted": false }
// or
{ "success": true, "waitlisted": true }
// or
{ "error": "Time conflict with: \"Workshop Name\"" }
```

**Logic:**

1. Validates user auth token
2. Fetches workshop details (times, capacity)
3. Checks for **time conflicts** with user's existing enrolled workshops
4. If conflict found: returns 409 with conflict workshop name
5. Counts current enrollments for the workshop
6. If at capacity: enrolls with `status = 'waitlisted'`
7. Otherwise: enrolls with `status = 'enrolled'`

**Time conflict detection:**

```
start_A < end_B AND end_A > start_B
```

This correctly handles the Renesas spanning case (17:10-18:10) blocking enrollment in overlapping talks.

---

## DELETE `/api/enroll`

Removes a user's enrollment from a workshop. If the user was **enrolled** (not waitlisted) and there are waitlisted users, the earliest waitlisted user is automatically promoted to enrolled.

**Auth:** Bearer token

**Request body:**

```json
{
  "workshopId": "string"
}
```

**Response:** `{ success: true }` or `{ error: "message" }`

**Waitlist auto-promotion logic:**

1. Before deleting, checks if the user's status was `enrolled`
2. Deletes the enrollment row
3. If the user was enrolled, queries for the oldest waitlisted user (`ORDER BY enrolled_at ASC LIMIT 1`)
4. Promotes that user's status from `waitlisted` to `enrolled`

This means admins no longer need to manually promote waitlisted users — it happens automatically when a spot opens up.

---

## GET `/api/workshop-instructions`

Proxies workshop instruction PDFs from Supabase Storage, hiding the storage URL from the client.

**Auth:** None (public)

**Query params:** `?id=<workshop_id>`

**Response:** The PDF file with `Content-Type: application/pdf` and `Content-Disposition: inline`

**Logic:**

1. Looks up the workshop's `instructions_url` column to verify instructions exist
2. Downloads the PDF from Supabase Storage at path `{workshopId}/instructions.pdf`
3. Serves the file with a clean filename derived from the workshop title

**Why a proxy?** The raw Supabase Storage URL exposes infrastructure details. This route hides it behind `/api/workshop-instructions?id=...`.

---

## POST `/api/contact`

Sends a contact form submission via email.

**Auth:** None (public)

**Request body:**

```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

**Behavior:**

1. Sends notification email to `ras.ntua@gmail.com`
2. Sends confirmation email to the sender
3. Uses Nodemailer with Gmail App Password

---

## POST `/api/subscribe`

Subscribes an email to the newsletter.

**Auth:** None (public)

**Request body:**

```json
{
  "email": "string"
}
```

**Behavior:**

1. Generates a confirmation token
2. Inserts row into `subscribers` table
3. Sends confirmation email with verification link
4. If email already exists but unconfirmed: resends confirmation
5. If already confirmed: returns message

---

## GET `/api/confirm`

Confirms a newsletter subscription.

**Auth:** None (public)

**Query params:** `?token=<confirmation_token>`

**Behavior:**

1. Looks up subscriber by token
2. Marks as confirmed
3. Redirects to `/?confirmed=true` (or `?confirmed=invalid`)

---

## GET `/api/admin/lookup`

Looks up a user's profile and workshop enrollments. Used by the admin check-in page after scanning a QR code.

**Auth:** Cookie-based session (requester must have `assigned_group = 'Admin'`)

**Query params:** `?userId=<uuid>`

**Response:**

```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "university": "string",
  "department": "string",
  "role": "student | company",
  "assignedGroup": "Not set | A | B | Admin",
  "enrollments": [
    {
      "workshopId": "string",
      "status": "enrolled | waitlisted",
      "title": "string",
      "type": "workshop | seminar",
      "startTime": "ISO 8601",
      "endTime": "ISO 8601"
    }
  ]
}
```

**Notes:**

- Uses `createSupabaseServer()` for auth check (cookie-based), then `getSupabase()` (service role) for data queries
- Returns 401 if not logged in, 403 if not admin, 404 if target user not found

---

## POST `/api/admin/assign-group`

Assigns a user to Group A or Group B. Used by the admin check-in page.

**Auth:** Cookie-based session (requester must have `assigned_group = 'Admin'`)

**Request body:**

```json
{
  "userId": "uuid",
  "group": "A | B"
}
```

**Response:** `{ "success": true, "group": "A" }` or `{ "error": "message" }`

**Notes:**

- Only accepts `"A"` or `"B"` as group values (returns 400 otherwise)
- Uses service role key to update the `profiles` table

---

## POST `/api/admin/upload-instructions`

Uploads or removes a workshop instruction PDF.

**Auth:** Cookie-based session (requester must have `assigned_group = 'Admin'`)

**Request body:** `multipart/form-data` with fields:

- `workshopId` (required) — The workshop ID
- `file` (optional) — A PDF file. If omitted, existing instructions are removed.

**Upload logic:**

1. Verifies admin auth
2. Uploads the PDF to `workshop-instructions` storage bucket at path `{workshopId}/instructions.pdf`
3. Saves the public URL in the workshop's `instructions_url` column

**Remove logic (no file):**

1. Removes the file from storage
2. Sets `instructions_url = NULL` on the workshop row

**Response:** `{ success: true }` or `{ error: "message" }`

---

## Authentication Pattern

API routes that require authentication follow this pattern:

```typescript
export async function POST(req: Request) {
  // Extract Bearer token
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify token with Supabase
  const db = getSupabase() // Service role client
  const { data: { user }, error } = await db.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // ... route logic using user.id
}
```

The client sends the token from the browser session:

```typescript
const supabase = createSupabaseBrowser()
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

fetch("/api/enroll", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ workshopId }),
})
```
