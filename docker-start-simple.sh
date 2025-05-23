#!/bin/bash

echo "Waiting for PostgreSQL to start..."
until nc -z db 5432; do
  echo "Waiting for PostgreSQL connection..."
  sleep 1
done
echo "PostgreSQL connection established"

sleep 3
echo "PostgreSQL started"

echo "Running database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "Starting Next.js application..."
exec npm run dev
