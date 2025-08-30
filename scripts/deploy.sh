#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
ENV_FILE=".env.production.local"
STAGING_ROOT="$(mktemp -d -t okto-mirolib.XXXXXX)"
STAGING_DIR="$STAGING_ROOT/okto-miro-rpg-tools-to-be-deployed"
EXCLUDES=(
  "--exclude=*.test.ts"
  "--exclude=*.test.ts.snap"
  "--exclude=*.map"
)

cleanup() { rm -rf "$STAGING_ROOT"; }
trap cleanup EXIT

# --- Pre-flight checks ---
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }; }
need git
need yarn
need rsync
need ssh

# --- Load environment variables (preserves quoted values) ---
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
else
  echo "No $ENV_FILE found" >&2
  exit 1
fi

: "${DEPLOY_SSH_HOST:?DEPLOY_SSH_HOST is required (e.g. user@host:/var/www/app/)}"
DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"

# Debug peek
env | grep '^PREACT' || true

# --- Determine branch and deployment target ---
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")"
if [[ -z "$CURRENT_BRANCH" || "$CURRENT_BRANCH" == "HEAD" ]]; then
  # CI fallback (GitHub Actions etc.)
  CURRENT_BRANCH="${GITHUB_REF_NAME:-main}"
fi

# Build PUBLIC_PATH and remote destination
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  export PUBLIC_PATH="/beta"
  # Ensure remote destination ends with /beta/
  # If DEPLOY_SSH_HOST contains a path already (has a colon), append /beta/
  # Else push to user's home under ./beta/
  if [[ "$DEPLOY_SSH_HOST" == *:* ]]; then
    # ensure a single trailing slash, then add beta/
    REMOTE_DEST="${DEPLOY_SSH_HOST%/}/beta/"
  else
    REMOTE_DEST="${DEPLOY_SSH_HOST}:beta/"
  fi
else
  export PUBLIC_PATH="/"
  # Ensure trailing slash for rsync target directory
  if [[ "$DEPLOY_SSH_HOST" == *:* ]]; then
    REMOTE_DEST="${DEPLOY_SSH_HOST%/}/"
  else
    REMOTE_DEST="${DEPLOY_SSH_HOST}:"
  fi
fi

echo "Branch:           $CURRENT_BRANCH"
echo "PUBLIC_PATH:      $PUBLIC_PATH"
echo "DEPLOY_SSH_PORT:  $DEPLOY_SSH_PORT"
echo "REMOTE_DEST:      $REMOTE_DEST"

# --- Build ---
yarn build

# --- Stage build output ---
mkdir -p "$STAGING_DIR"
# Copy contents of dist/ into STAGING_DIR with excludes
rsync -a \
  "${EXCLUDES[@]}" \
  "dist/" \
  "$STAGING_DIR/"

# --- Deploy (rsync over SSH) ---
# -a  : archive (perms, times, etc.)
# -z  : compress
# --delete : remove files on remote that don't exist locally
# Trailing slashes: send CONTENTS of staging dir to destination dir
rsync -az --delete --progress \
  -e "ssh -p $DEPLOY_SSH_PORT" \
  "$STAGING_DIR/" \
  "$REMOTE_DEST"

echo "✅ Deploy complete."
