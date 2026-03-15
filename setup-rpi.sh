#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVICE_USER="${SUDO_USER:-$USER}"

echo "==> Checking Docker access..."
if ! docker info > /dev/null 2>&1; then
  echo "ERROR: Cannot reach Docker. Try rebooting or running: sudo reboot"
  echo "Then re-run this script."
  exit 1
fi

echo "==> Pulling latest code..."
cd "$PROJECT_DIR"
git pull

echo "==> Installing npm dependencies..."
npm install

echo "==> Starting Supabase..."
npx supabase start

echo ""
echo "==> Supabase is running. Copy the 'Secret' key printed above."
echo "    Then create your .env.local file:"
echo ""
echo "    nano $PROJECT_DIR/.env.local"
echo ""
echo "    Paste this template and fill in the values:"
echo "---------------------------------------------------"
cat <<'EOF'
GMAIL_USER=ras.ntua@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<sb_secret_... from supabase start output>

NEXT_PUBLIC_SITE_URL=http://<your-tailscale-hostname>:3000
EOF
echo "---------------------------------------------------"
echo ""
read -p "Press ENTER once you have saved .env.local to continue..."

echo "==> Applying database migrations..."
npx supabase db reset

echo "==> Building Next.js..."
npm run build

echo "==> Installing systemd services..."

sudo tee /etc/systemd/system/supabase.service > /dev/null <<EOF
[Unit]
Description=Supabase local
After=docker.service
Requires=docker.service

[Service]
User=$SERVICE_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$(which npx) supabase start
ExecStop=$(which npx) supabase stop
RemainAfterExit=yes
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/nextjs.service > /dev/null <<EOF
[Unit]
Description=Next.js RAS NTUA
After=supabase.service network.target
Requires=supabase.service

[Service]
User=$SERVICE_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$(which npm) start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable supabase nextjs
sudo systemctl start supabase nextjs

echo ""
echo "==> Done! Services are running and will auto-start on boot."
echo "    Check status with:  sudo systemctl status nextjs"
echo "    View logs with:     sudo journalctl -u nextjs -f"
