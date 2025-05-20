#!/bin/sh
# Script to handle database migrations and seeding

set -e

echo "🔄 Running Prisma Generate..."
npx prisma generate

echo "🔄 Running Prisma Migrations..."
npx prisma migrate deploy

echo "✅ Database setup complete!"

# Additional seeding data could be added here
# npx prisma db seed

exit 0
