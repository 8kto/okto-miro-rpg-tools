#!/usr/bin/env bash
set -euo pipefail

# Resolve project root even when called from subdirs
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Extract version from package.json via Node (robust and cross-platform)
VERSION="$(node -p "require('$APP_ROOT/package.json').version")"

# Export for all children (subshells, dev server, etc.)
export PREACT_APP_VERSION="$VERSION"

# Optional: also expose a generic VERSION for tooling that expects it
export VERSION="$VERSION"

# If you want, also mirror into a dotenv file for tools that read .env.*
# Uncomment these three lines if desired:
# printf 'PREACT_APP_VERSION=%s\n' "$PREACT_APP_VERSION" > "$APP_ROOT/.env.version"
# printf 'VERSION=%s\n' "$VERSION" >> "$APP_ROOT/.env.version"
# # Do not automatically overwrite .env/.env.local to avoid clobbering user values.

# Exec the target command so it inherits env and PID is replaced
# Usage: scripts/with-version.sh <command> [args...]
exec "$@"
