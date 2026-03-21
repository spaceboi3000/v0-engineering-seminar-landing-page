#!/bin/bash
# Checks for new commits on the deployment branch.
# If changes are found, pulls them, rebuilds, and restarts the Next.js service.
# Intended to run on a systemd timer every few minutes.

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BRANCH="deployment"
LOG_PREFIX="[auto-deploy]"

cd "$PROJECT_DIR"

# Fetch latest from remote silently
git fetch origin "$BRANCH" --quiet

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "$LOG_PREFIX No changes. Already at $(git rev-parse --short HEAD)."
  exit 0
fi

echo "$LOG_PREFIX New commits detected. Pulling..."
git pull origin "$BRANCH"

echo "$LOG_PREFIX Installing dependencies..."
npm install --prefer-offline

echo "$LOG_PREFIX Building..."
npm run build

echo "$LOG_PREFIX Restarting Next.js service..."
sudo systemctl restart nextjs

echo "$LOG_PREFIX Done. Now at $(git rev-parse --short HEAD)."
