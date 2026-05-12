#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
ENV_FILE="$BACKEND_DIR/.env"
LOG_DIR="${LOG_DIR:-$ROOT_DIR/logs}"
START_LOG="$LOG_DIR/start.log"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

mkdir -p "$LOG_DIR"
: >"$START_LOG"
: >"$BACKEND_LOG"
: >"$FRONTEND_LOG"

echo "Startup log: $START_LOG"
echo "Backend log: $BACKEND_LOG"
echo "Frontend log: $FRONTEND_LOG"
echo "Tip: tail -f $START_LOG $BACKEND_LOG $FRONTEND_LOG"

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_NAME="${DB_NAME:-todolist}"
DB_SSLMODE="${DB_SSLMODE:-disable}"
PORT="${PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
VITE_PROXY_TARGET="${VITE_PROXY_TARGET:-http://127.0.0.1:${PORT}}"
GOPROXY="${GOPROXY:-https://goproxy.cn,direct}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    echo "Install Go, Node.js/npm, and local PostgreSQL before running this script."
    exit 1
  fi
}

require_command go
require_command npm
require_command psql
require_command createdb

export PGPASSWORD="$DB_PASSWORD"

max_migration_version() {
  local max=0
  local file base version

  for file in "$BACKEND_DIR"/migrations/*.up.sql; do
    [ -e "$file" ] || continue
    base="$(basename "$file")"
    version="${base%%_*}"
    version=$((10#$version))
    if [ "$version" -gt "$max" ]; then
      max="$version"
    fi
  done

  echo "$max"
}

database_migration_state() {
  local database="$1"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$database" -tAc \
    "select version::text || ' ' || dirty::text from schema_migrations limit 1" 2>/dev/null || true
}

ensure_database() {
  local database="$1"
  if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$database" -c "select 1" >/dev/null 2>&1; then
    echo "Creating database: $database"
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$database"
  fi
}

if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "select 1" >/dev/null 2>&1; then
  echo "Cannot connect to PostgreSQL at ${DB_HOST}:${DB_PORT} as ${DB_USER}."
  echo "Start your local PostgreSQL service first, then rerun ./start.sh."
  exit 1
fi

ensure_database "$DB_NAME"

MAX_MIGRATION_VERSION="$(max_migration_version)"
MIGRATION_STATE="$(database_migration_state "$DB_NAME")"
if [ -n "$MIGRATION_STATE" ]; then
  read -r CURRENT_MIGRATION_VERSION CURRENT_MIGRATION_DIRTY <<<"$MIGRATION_STATE"
  if [ "$CURRENT_MIGRATION_DIRTY" = "true" ] || [ "$CURRENT_MIGRATION_VERSION" -gt "$MAX_MIGRATION_VERSION" ]; then
    ORIGINAL_DB_NAME="$DB_NAME"
    DB_NAME="${LOCAL_DB_NAME:-${DB_NAME}_local}"
    echo "Database ${ORIGINAL_DB_NAME} has migration version ${CURRENT_MIGRATION_VERSION}; this repo only has migrations through ${MAX_MIGRATION_VERSION}."
    echo "Using local development database instead: ${DB_NAME}"
    ensure_database "$DB_NAME"
    MIGRATION_STATE="$(database_migration_state "$DB_NAME")"
    if [ -n "$MIGRATION_STATE" ]; then
      read -r CURRENT_MIGRATION_VERSION CURRENT_MIGRATION_DIRTY <<<"$MIGRATION_STATE"
      if [ "$CURRENT_MIGRATION_DIRTY" = "true" ] || [ "$CURRENT_MIGRATION_VERSION" -gt "$MAX_MIGRATION_VERSION" ]; then
        echo "Database ${DB_NAME} also has incompatible migration state: version=${CURRENT_MIGRATION_VERSION}, dirty=${CURRENT_MIGRATION_DIRTY}."
        echo "Set LOCAL_DB_NAME to a new database name and rerun ./start.sh."
        exit 1
      fi
    fi
  fi
fi

export DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME DB_SSLMODE PORT FRONTEND_PORT GOPROXY
DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSLMODE}"

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install) 2>&1 | tee -a "$START_LOG"
fi

echo "Running database migrations..."
(cd "$BACKEND_DIR" && DATABASE_URL="$DATABASE_URL" GOPROXY="$GOPROXY" go run cmd/migrate/main.go -direction up) 2>&1 | tee -a "$START_LOG"

echo "Seeding test account..."
psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKEND_DIR/scripts/seed_test_user.sql" >>"$START_LOG" 2>&1

cleanup() {
  for pid in $(jobs -p); do
    kill "$pid" 2>/dev/null || true
  done
}
trap cleanup EXIT INT TERM

echo "Starting backend on http://127.0.0.1:${PORT}"
(cd "$BACKEND_DIR" && GOPROXY="$GOPROXY" go run cmd/main.go) >>"$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "Backend pid: $BACKEND_PID"

echo "Starting frontend on http://127.0.0.1:${FRONTEND_PORT}"
(cd "$FRONTEND_DIR" && FRONTEND_PORT="$FRONTEND_PORT" VITE_PROXY_TARGET="$VITE_PROXY_TARGET" npm run dev -- --host 0.0.0.0) >>"$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "Frontend pid: $FRONTEND_PID"
echo "View logs with: tail -f $BACKEND_LOG $FRONTEND_LOG"

wait
