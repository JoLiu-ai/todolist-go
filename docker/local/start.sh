#!/bin/sh

set -e  # Exit on error

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "Database is ready!"

# Clean up any backup migration files
cd /go/src/cute-todo/backend/migrations
echo "Current directory: $(pwd)"
echo "Listing migration files before cleanup:"
ls -la

# Keep only the init_schema migrations
echo "Cleaning up migration files..."
rm -f *.bak || true
for f in 000*.sql; do
  if [ "$f" != "000001_init_schema.up.sql" ] && [ "$f" != "000001_init_schema.down.sql" ]; then
    rm -f "$f"
  fi
done

echo "Listing migration files after cleanup:"
ls -la

# Run migrations
echo "Running database migrations..."
cd /go/src/cute-todo/backend
echo "Migration connection string: postgres://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable"
migrate -path migrations -database "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" up

# Verify database tables
echo "Verifying database tables..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\dt"

# Check users table data
echo "Checking users table data..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT id, username, email, password FROM users;"

# Start the application with air
echo "Starting application..."
air -c .air.toml 