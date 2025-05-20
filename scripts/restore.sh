#!/bin/bash
# Database restore script

# Set variables
DOCKER_COMPOSE_FILE="docker-compose.clean.yml"
DB_CONTAINER="recipes-postgres"

# Check for a backup file argument
if [ -z "$1" ]; then
  echo "Error: No backup file specified!"
  echo "Usage: ./restore.sh <backup_file>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file '$BACKUP_FILE' not found!"
  exit 1
fi

# Check if container is running
if ! docker-compose -f $DOCKER_COMPOSE_FILE ps -q $DB_CONTAINER | grep -q .; then
  echo "Error: Database container is not running!"
  echo "Please start the containers with: docker-compose -f $DOCKER_COMPOSE_FILE up -d"
  exit 1
fi

# If the file is compressed, decompress it
TEMP_FILE=""
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "Decompressing backup file..."
  TEMP_FILE="/tmp/recipes_restore_$(date +%s).sql"
  gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
  BACKUP_FILE="$TEMP_FILE"
elif [[ "$BACKUP_FILE" == *.zip ]]; then
  echo "Decompressing backup file..."
  TEMP_FILE="/tmp/recipes_restore_$(date +%s).sql"
  unzip -p "$BACKUP_FILE" > "$TEMP_FILE"
  BACKUP_FILE="$TEMP_FILE"
fi

# Restore database
echo "Warning: This will overwrite your current database! Continue? (y/n)"
read -r confirmation
if [[ "$confirmation" =~ ^[Yy]$ ]]; then
  echo "Restoring database from backup..."
  cat "$BACKUP_FILE" | docker-compose -f $DOCKER_COMPOSE_FILE exec -T $DB_CONTAINER psql -U postgres -d recipes
  
  # Check if restore was successful
  if [ $? -eq 0 ]; then
    echo "Database restored successfully!"
  else
    echo "Error: Database restore failed!"
    exit 1
  fi
else
  echo "Restore cancelled."
fi

# Clean up temp file
if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
  rm -f "$TEMP_FILE"
fi
