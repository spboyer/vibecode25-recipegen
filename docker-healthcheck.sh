#!/bin/sh
# Docker healthcheck for the Next.js application

# Try to connect to the Next.js server
wget --spider -q http://localhost:3000 || exit 1

# Success
exit 0
