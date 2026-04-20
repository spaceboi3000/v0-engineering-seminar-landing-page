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

Removes a user's enrollment from a workshop.

**Auth:** Bearer token

**Request body:**

```json
{
  "workshopId": "string"
}
```

**Response:** `{ success: true }` or `{ error: "message" }`

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
