#!/bin/sh

# Simple script to check database connection

set -e

# Try to connect to the database
pg_isready -U postgres -h localhost || exit 1

# Check for the favorites table
psql -U postgres -d recipes -c "SELECT 1 FROM favorites LIMIT 1" &>/dev/null || exit 1

# Success
exit 0
