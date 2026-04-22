# Email Blast Script

Send personalized bulk emails to all registered RoboTalk users via Gmail SMTP.

## Prerequisites

```bash
pip install supabase markdown
```

The script reads credentials from `.env.local` in the project root. Required variables:

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address used as the sender |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your regular password) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS) |

## Writing an email template

Create a Markdown file with YAML frontmatter for the subject line:

```markdown
---
subject: Your Subject Line Here
---

Γεια σου **{{first_name}}**,

Your email body in Markdown...
```

### Template variables

| Variable | Description |
|---|---|
| `{{first_name}}` | Recipient's first name, automatically converted to Greek vocative case (e.g. "Νίκος" becomes "Νίκο") |

The Markdown body is converted to HTML before sending.

## Usage

### Test mode (send to specific addresses only)

Always test first before blasting to everyone:

```bash
python scripts/send_blast.py scripts/workshops_open.md --test your@email.com
```

This looks up the test email(s) in the auth system, resolves their profile name, and sends only to them. Use this to verify formatting and content.

### Send to all registered users

```bash
python scripts/send_blast.py scripts/workshops_open.md
```

This will:

1. Fetch all profiles from Supabase
2. Resolve each user's email from Supabase Auth
3. Show a preview (subject, recipient count, body snippet)
4. Ask for confirmation (`yes` to proceed)
5. Send emails with 300ms throttle between each
6. Write a log file to `scripts/logs/`

## How it works

1. Parses the Markdown file: extracts subject from frontmatter, converts body to HTML
2. Connects to Supabase with the service role key
3. Fetches all rows from the `profiles` table (`id`, `first_name`)
4. For each profile, fetches the email from Supabase Auth via `admin.get_user_by_id()`
5. Personalizes the template: replaces `{{first_name}}` with the vocative form of the name
6. Sends via Gmail SMTP (SSL, port 465)
7. Logs results to `scripts/logs/<mode>_<timestamp>.log`

## Greek vocative conversion

The script automatically converts Greek first names from nominative to vocative case for natural-sounding greetings:

- -ος endings: Νίκος -> Νίκο
- -ας endings: Κώστας -> Κώστα
- -ης endings: Γιάννης -> Γιάννη
- -ιος endings: Δημήτριος -> Δημήτριε

Add irregular names to the `VOCATIVE_EXCEPTIONS` dictionary in the script if needed.

## Log files

Each run creates a log file in `scripts/logs/`:

- `blast_2026-04-22_15-30-00.log` — full send
- `test_2026-04-22_15-30-00.log` — test send

Log format:
```
Email Blast Log — 2026-04-22 15:30:00
Mode: BLAST
Template: workshops_open.md
Subject: RoboTalk 2026 — Οι εγγραφές στα Workshops άνοιξαν!
Recipients: 150
============================================================
[OK]    user@example.com (Νίκο)
[FAIL]  bad@example.com (Κώστα) — Connection refused
============================================================
SUMMARY
  Total:  150
  Sent:   149
  Failed: 1
```

## Existing templates

| File | Purpose |
|---|---|
| `scripts/workshops_open.md` | Announce that workshop enrollment is open |

## Safety

- The script always asks for confirmation before sending
- Use `--test` to verify with your own email first
- Emails are throttled at 300ms intervals to avoid Gmail rate limits
- Gmail has a daily sending limit of ~500 emails (regular) or ~2000 (Google Workspace)
- Logs are saved for audit purposes
