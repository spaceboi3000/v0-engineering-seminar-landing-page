# Environment Setup

This guide walks you through getting the RoboTalk project running on your local machine.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node.js)
- **Git**
- A **Supabase** project (free tier works fine)
- A **Gmail account** with an App Password for sending emails

## 1. Clone the Repository

```bash
git clone https://github.com/spaceboi3000/v0-engineering-seminar-landing-page.git
cd v0-engineering-seminar-landing-page
```

## 2. Install Dependencies

```bash
npm install
```

Key dependencies include:

| Package | Purpose |
|---------|---------|
| `next` (16.x) | React framework with App Router |
| `@supabase/supabase-js` | Database & auth client |
| `@supabase/ssr` | Server-side Supabase session management |
| `nodemailer` | Sending emails via Gmail |
| `qrcode.react` | QR code generation for check-in |
| `lucide-react` | Icon library |
| `tailwindcss` + `tailwind-merge` | Utility-first CSS |
| `zod` + `react-hook-form` | Form validation |
| `sonner` | Toast notifications |

## 3. Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL**, **Anon Key**, and **Service Role Key** from Settings > API

### Link the Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Apply Database Migrations

Run all migrations in order to set up tables, policies, and views:

```bash
# Apply all migrations to remote Supabase
for f in supabase/migrations/*.sql; do
  cat "$f" | npx supabase db query --linked
done
```

!!! info "Migration files"
    Migrations are in `supabase/migrations/` and are numbered chronologically.
    See [Database Schema](../architecture/database.md) for details on each table.

## 4. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Gmail credentials for Nodemailer
# Use an App Password (NOT your regular Gmail password)
# Google Account > Security > 2-Step Verification > App passwords
GMAIL_USER=ras.ntua@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here

# Supabase - get these from your project's Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# The public URL of your site (used to build confirmation links)
# Locally: http://localhost:3000  |  Production: https://yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting a Gmail App Password

1. Go to your Google Account > Security
2. Enable **2-Step Verification** if not already enabled
3. Go to **App passwords** (search for it in account settings)
4. Generate a new app password for "Mail"
5. Use this 16-character password as `GMAIL_APP_PASSWORD`

!!! warning "Security"
    Never commit `.env.local` to git. It is already in `.gitignore`.

## 5. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 6. Create a Test User

1. Visit `http://localhost:3000/register`
2. Fill in the registration form
3. Check your email for the confirmation link (or confirm via Supabase dashboard)
4. Log in at `http://localhost:3000/login`
5. You should now see the attendee dashboard at `/dashboard`

!!! tip "Confirming email manually"
    If emails aren't sending locally, you can confirm a user directly in the
    Supabase dashboard: **Authentication > Users > click user > Confirm email**.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server (uses `$PORT` or 3000) |
| `npm run lint` | Run ESLint |
