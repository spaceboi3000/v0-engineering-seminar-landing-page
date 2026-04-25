# RoboTalk 2026 - Developer Documentation

Welcome to the developer documentation for the **RoboTalk 2026** event platform, built by [IEEE RAS NTUA](https://www.facebook.com/RASNTUA/).

## What is this project?

A full-stack Next.js web application that serves as both a **public marketing site** and an **attendee dashboard** for the annual RoboTalk engineering seminar. The platform handles:

- **Landing page** with event information, speaker/sponsor profiles, gallery, location, and contact form
- **User registration & authentication** via Supabase Auth with email confirmation
- **Attendee dashboard** with QR check-in, real-time schedule with workshop enrollment, CV upload, and a mini-game
- **Group-based scheduling** splitting attendees into groups (A/B) for parallel sessions
- **Workshop enrollment** with capacity limits, waitlists, auto-promotion, and time-conflict detection
- **Workshop instruction PDFs** uploadable by admins, served via proxy to hide infrastructure URLs
- **Real-time schedule updates** via 15-second polling for enrollment counts and status changes
- **Admin panel** with QR check-in scanner, group assignment, and instructions management
- **Automated cleanup** of unconfirmed accounts via pg_cron
- **Email notifications** for contact forms and newsletter subscriptions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Email | Nodemailer via Gmail |
| Deployment | Raspberry Pi + WireGuard tunnel + systemd |

## Quick Links

- [Environment Setup](getting-started/setup.md) - Get the project running locally
- [Architecture Overview](architecture/overview.md) - Understand the codebase structure
- [Adapting for Future Events](guides/future-events.md) - How to reuse this for RoboTalk 2027+
- [Admin Operations](guides/admin-ops.md) - Managing users, groups, and schedule via Supabase

## Project Structure

```
.
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # Server-side API endpoints
│   │   ├── register/       # User profile creation
│   │   ├── enroll/         # Workshop enrollment (POST/DELETE)
│   │   ├── contact/        # Contact form email
│   │   ├── subscribe/      # Newsletter subscription
│   │   ├── confirm/        # Email confirmation
│   │   ├── workshop-instructions/  # PDF proxy (hides storage URL)
│   │   └── admin/          # Admin APIs (lookup, assign-group, upload-instructions)
│   ├── admin/              # Admin check-in page (QR scanner, group assignment)
│   ├── dashboard/          # Protected attendee dashboard
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── cv-template/        # Printable CV template
│   ├── speakers/[id]/      # Dynamic speaker detail pages
│   ├── sponsors/[id]/      # Dynamic sponsor detail pages
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── dashboard/          # Dashboard-specific components
│   └── *.tsx               # Landing page sections
├── data/                   # Static data (speakers, sponsors)
├── lib/                    # Utilities & Supabase clients
├── public/                 # Static assets (images, fonts)
├── supabase/
│   └── migrations/         # SQL migration files
├── auto-deploy.sh          # Auto-deploy script for Raspberry Pi
├── setup-rpi.sh            # Raspberry Pi initial setup
├── tunnel.conf             # WireGuard tunnel config
└── proxy.ts                # Supabase SSR session middleware
```
