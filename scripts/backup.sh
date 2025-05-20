#!/bin/bash
# Database backup script

# Set variables
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/recipes_backup_${TIMESTAMP}.sql"
DOCKER_COMPOSE_FILE="docker-compose.clean.yml"
DB_CONTAINER="recipes-postgres"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if container is running
if ! docker-compose -f $DOCKER_COMPOSE_FILE ps -q $DB_CONTAINER | grep -q .; then
  echo "Error: Database container is not running!"
  echo "Please start the containers with: docker-compose -f $DOCKER_COMPOSE_FILE up -d"
  exit 1
fi

# Create backup
echo "Creating database backup..."
docker-compose -f $DOCKER_COMPOSE_FILE exec -T $DB_CONTAINER pg_dump -U postgres -d recipes > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ] && [ -s $BACKUP_FILE ]; then
  echo "Backup created successfully: $BACKUP_FILE"
  
  # Compress the backup file
  gzip $BACKUP_FILE
  echo "Backup compressed: ${BACKUP_FILE}.gz"
else
  echo "Error: Backup failed!"
  rm -f $BACKUP_FILE
  exit 1
fi
