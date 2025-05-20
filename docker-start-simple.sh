#!/bin/sh
set -e

# Wait for PostgreSQL to be ready (more robust check)
echo "Waiting for PostgreSQL to start..."
until nc -z db 5432; do
  echo "Waiting for PostgreSQL connection..."
  sleep 1
done
echo "PostgreSQL connection established"

# Give PostgreSQL some additional time to be fully ready for connections
sleep 3
echo "PostgreSQL started"

# Run database migrations with improved error handling
echo "Running database migrations..."
npx prisma generate

# Try to reset the database first to ensure clean state
echo "Cleaning database state..."
npx prisma migrate reset --force

# Then run migrations
echo "Applying migrations..."
npx prisma migrate deploy

# Start the app
echo "Starting Next.js application..."
exec npm run dev
