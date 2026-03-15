# RAS NTUA — Engineering Seminar Landing Page

Landing page for the IEEE RAS NTUA Engineering Seminar. Built with Next.js 16, Tailwind CSS, and Supabase. Features a contact form, a double opt-in mailing list, and is designed to be self-hosted on a Raspberry Pi 5 (or any Linux server) with full Docker-based Supabase local deployment.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Self-Hosting on Raspberry Pi](#self-hosting-on-raspberry-pi)
- [Deploying to a Cloud Supabase Project](#deploying-to-a-cloud-supabase-project)

---

## Features

- **Landing page** with sections: Hero, About, Organizers, Location, Past Events, Sponsors, Contact
- **Contact form** — submissions are emailed directly to `ras.ntua@gmail.com` and a confirmation is sent to the sender
- **Mailing list subscription** — double opt-in flow: subscriber gets a confirmation email with a unique link; only confirmed addresses are stored as active
- **Subscriber statistics** — each row records `subscribed_at` and `confirmed_at` timestamps
- **Responsive design** — mobile-first, dark theme
- **Self-hostable** — ships with Supabase CLI config and a setup script for Raspberry Pi deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Email | Nodemailer + Gmail SMTP |
| Runtime | Node.js (self-hosted) |
| Infra (optional) | Raspberry Pi 5, Docker, systemd, Tailscale |

---

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── contact/route.ts      # Contact form handler
│   │   ├── subscribe/route.ts    # Newsletter subscription handler
│   │   └── confirm/route.ts      # Email confirmation handler
│   ├── page.tsx                  # Homepage
│   └── layout.tsx
├── components/
│   ├── contact.tsx               # Contact form UI
│   ├── newsletter.tsx            # Subscribe form UI
│   ├── organizers.tsx            # Organizers section (mobile-responsive)
│   └── ...
├── lib/
│   ├── mailer.ts                 # Nodemailer transporter
│   └── supabase.ts               # Supabase client (lazy-initialized)
├── supabase/
│   ├── config.toml               # Supabase CLI config
│   └── migrations/
│       └── 20260316000000_create_subscribers.sql
├── setup-rpi.sh                  # One-shot RPi deployment script
└── .env.local.example            # Environment variable template
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Docker (for local Supabase)
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/spaceboi3000/v0-engineering-seminar-landing-page.git
cd v0-engineering-seminar-landing-page

# 2. Install dependencies
npm install

# 3. Start local Supabase (first run pulls Docker images, takes a few minutes)
npx supabase start

# 4. Copy the env template and fill in your values
cp .env.local.example .env.local
# Edit .env.local — see Environment Variables section below

# 5. Apply the database migration
npx supabase db reset

# 6. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.
The Supabase Studio (database browser) is at `http://127.0.0.1:54323`.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
# Gmail credentials for sending emails via Nodemailer
# Do NOT use your regular Gmail password — create an App Password:
# Google Account → Security → 2-Step Verification → App passwords
GMAIL_USER=ras.ntua@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

# Supabase project credentials
# For local dev: use the output of `npx supabase start`
# For production (cloud): Settings → API in your Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# The public URL of the site — used to build confirmation email links
# Local: http://localhost:3000
# Production: your domain or Tailscale hostname
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Never commit `.env.local`** — it is gitignored. The `.env.local.example` file serves as the template and must only contain placeholder values.

---

## Database Schema

The following table is created by the migration in `supabase/migrations/`:

```sql
create table subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        unique not null,
  token         uuid        not null,
  confirmed     boolean     not null default false,
  subscribed_at timestamptz not null,
  confirmed_at  timestamptz
);
```

- `token` — single-use UUID sent in the confirmation email link
- `confirmed` — `false` until the user clicks the confirmation link
- `subscribed_at` — timestamp of the subscription request
- `confirmed_at` — timestamp of when the user confirmed (null until then)

---

## API Routes

### `POST /api/contact`

Sends the contact form message to `ras.ntua@gmail.com` and a confirmation to the sender.

**Request body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hello!" }
```

**Responses:**
- `200` — emails sent successfully
- `400` — missing fields
- `500` — email send failure

---

### `POST /api/subscribe`

Registers a new subscriber and sends a confirmation email.

**Request body:**
```json
{ "email": "jane@example.com" }
```

**Responses:**
- `200` — saved and confirmation email sent
- `400` — missing email
- `409` — email already confirmed and subscribed
- `500` — database or email error

If the email exists but is unconfirmed, the confirmation email is resent.

---

### `GET /api/confirm?token=<uuid>`

Confirms a subscription via the link sent in the confirmation email.

**Redirects to:**
- `/?confirmed=success` — subscription activated
- `/?confirmed=already` — was already confirmed
- `/?confirmed=invalid` — token not found or missing

---

## Self-Hosting on Raspberry Pi

This project ships with a setup script (`setup-rpi.sh`) that automates the full deployment on a Raspberry Pi 5 (or any Debian/Ubuntu ARM64 machine).

### Prerequisites on the RPi

- Raspberry Pi OS (64-bit) or Ubuntu Server
- Node.js 18+ (`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs`)
- Docker

### One-time setup

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Reboot so the docker group takes effect
sudo reboot
```

After reboot:

```bash
# 3. Clone the repo
git clone https://github.com/spaceboi3000/v0-engineering-seminar-landing-page.git
cd v0-engineering-seminar-landing-page

# 4. Run the setup script
chmod +x setup-rpi.sh
./setup-rpi.sh
```

The script will:
1. Pull the latest code and install npm dependencies
2. Start local Supabase (downloads Docker images on first run)
3. Pause and prompt you to create `.env.local` with the printed credentials
4. Apply the database migration
5. Build the Next.js app
6. Install and enable two systemd services (`supabase` and `nextjs`) that auto-start on boot

### Accessing the site

If you use **Tailscale**, the site is accessible from any device on your tailnet at:
```
http://<your-rpi-tailscale-hostname>:3000
```

Set `NEXT_PUBLIC_SITE_URL` to that address in `.env.local` so confirmation email links resolve correctly.

### Useful commands

```bash
# Check service status
sudo systemctl status nextjs
sudo systemctl status supabase

# View live logs
sudo journalctl -u nextjs -f
sudo journalctl -u supabase -f

# Restart services
sudo systemctl restart nextjs

# Update to latest code
cd ~/v0-engineering-seminar-landing-page
git pull
npm install
npm run build
sudo systemctl restart nextjs
```

---

## Deploying to a Cloud Supabase Project

If you prefer a managed Supabase instance instead of self-hosting:

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run:
   ```sql
   create table subscribers (
     id            uuid        primary key default gen_random_uuid(),
     email         text        unique not null,
     token         uuid        not null,
     confirmed     boolean     not null default false,
     subscribed_at timestamptz not null,
     confirmed_at  timestamptz
   );
   ```
3. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`
4. Update `.env.local` with those values
5. Build and deploy normally (`npm run build && npm start`)
