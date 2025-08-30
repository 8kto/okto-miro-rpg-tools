#!/usr/bin/env bash
set -euo pipefail

# Load environment variables
ENV_FILE=".env.production.local"

# Load environment variables from .env.production.local
if [[ -f "$ENV_FILE" ]]; then
  # Export all variables defined while sourcing
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
else
  echo "No $ENV_FILE found" >&2
  exit 1
fi

env | grep PREACT

# Get the current git branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Check if current branch is 'main'
if [ "$CURRENT_BRANCH" != "main" ]; then
  DEPLOY_SSH_HOST="$DEPLOY_SSH_HOST"beta
  PUBLIC_PATH=/beta
else
  PUBLIC_PATH=/
fi

yarn build
mkdir -p /tmp/okto-miro-rpg-tools-to-be-deployed
rm -rf /tmp/okto-miro-rpg-tools-to-be-deployed/*
rsync \
  -av \
  --exclude='*.test.ts' \
  --exclude='*.test.ts.snap' \
  --exclude='*.map' \
  dist/ \
  /tmp/okto-miro-rpg-tools-to-be-deployed

# Deploy to remote server
echo "DEPLOY_SSH_PORT: $DEPLOY_SSH_PORT"
echo "DEPLOY_SSH_HOST: $DEPLOY_SSH_HOST"
scp -P $DEPLOY_SSH_PORT -r /tmp/okto-miro-rpg-tools-to-be-deployed/* $DEPLOY_SSH_HOST
