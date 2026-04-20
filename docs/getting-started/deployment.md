# Deployment

The project is designed to run on a **Raspberry Pi** with a **WireGuard tunnel** for public HTTPS access. It also works on any Linux server or cloud VM.

## Architecture

```
Internet
  │
  ▼
pyjam.as tunnel (WireGuard)       ← Public HTTPS endpoint
  │
  ▼
Raspberry Pi (local network)
  ├── Next.js (port 3000)         ← systemd service: nextjs
  ├── Supabase local (optional)   ← systemd service: supabase
  └── auto-deploy.sh              ← systemd timer: polls git for updates
```

## Option A: Raspberry Pi Setup (Full)

### Prerequisites

- Raspberry Pi 4 or newer with Raspberry Pi OS
- Docker installed and running
- Internet access
- A [pyjam.as](https://tunnel.pyjam.as) tunnel or similar reverse proxy

### Initial Setup

Run the setup script from the project root:

```bash
sudo bash setup-rpi.sh
```

This script will:

1. Verify Docker is running
2. Pull latest code from git
3. Install npm dependencies
4. Start local Supabase (via Docker)
5. Prompt you to create `.env.local`
6. Apply database migrations
7. Build Next.js for production
8. Install and enable two systemd services:
    - `supabase.service` - Runs local Supabase
    - `nextjs.service` - Runs the Next.js production server

### Systemd Service Management

```bash
# Check service status
sudo systemctl status nextjs
sudo systemctl status supabase

# View real-time logs
sudo journalctl -u nextjs -f

# Restart after manual changes
sudo systemctl restart nextjs
```

## Option B: Cloud Supabase + Local Build

If you prefer using Supabase's hosted service (recommended for production):

1. Create a project at [supabase.com](https://supabase.com)
2. Link the CLI: `npx supabase link --project-ref YOUR_REF`
3. Apply migrations: `cat supabase/migrations/*.sql | npx supabase db query --linked`
4. Set `.env.local` with the cloud Supabase URL and keys
5. Build and start:

```bash
npm run build
npm start
```

## Auto-Deploy

The `auto-deploy.sh` script enables **continuous deployment** from the `deployment` branch:

```bash
#!/bin/bash
# Runs on a systemd timer every few minutes
# 1. Fetches latest from origin/deployment
# 2. If new commits: pulls, npm install, npm build, restarts nextjs service
```

### Setting Up the Timer

Create a systemd timer to run auto-deploy every 3 minutes:

```bash
# /etc/systemd/system/auto-deploy.timer
[Unit]
Description=Auto-deploy timer

[Timer]
OnBootSec=60
OnUnitActiveSec=180

[Install]
WantedBy=timers.target
```

```bash
# /etc/systemd/system/auto-deploy.service
[Unit]
Description=Auto-deploy RoboTalk

[Service]
Type=oneshot
WorkingDirectory=/path/to/project
ExecStart=/path/to/project/auto-deploy.sh
User=pi
```

```bash
sudo systemctl enable --now auto-deploy.timer
```

## WireGuard Tunnel

The project includes a `tunnel.conf` for [pyjam.as](https://tunnel.pyjam.as) WireGuard tunneling. This gives your Raspberry Pi a public HTTPS URL.

### Setup

```bash
# Install WireGuard
sudo apt install wireguard

# Copy the config
sudo cp tunnel.conf /etc/wireguard/tunnel.conf

# Start the tunnel
sudo wg-quick up tunnel

# Enable on boot
sudo systemctl enable wg-quick@tunnel
```

The tunnel maps `https://i8abfz.tunnel.pyjam.as/` to your local port 3000.

!!! warning "Tunnel Config"
    The `tunnel.conf` file contains a private key. Do not share it publicly.
    Each deployment needs its own tunnel key pair.

## Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable base, PR target |
| `nick` | Active development branch |
| `deployment` | Production branch, auto-deployed to Raspberry Pi |

Typical workflow:

1. Develop on `nick`
2. Merge `nick` into `deployment`
3. Push `deployment` to origin
4. Auto-deploy script picks up changes on the Raspberry Pi

## Environment Variables (Production)

Same as development, but with production values:

```env
GMAIL_USER=ras.ntua@gmail.com
GMAIL_APP_PASSWORD=<real app password>
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production anon key>
SUPABASE_SERVICE_ROLE_KEY=<production service role key>
NEXT_PUBLIC_SITE_URL=https://i8abfz.tunnel.pyjam.as
```
