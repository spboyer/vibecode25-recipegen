# PowerShell Database Backup Script

# Set variables
$BACKUP_DIR = "./backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR/recipes_backup_$TIMESTAMP.sql"
$DOCKER_COMPOSE_FILE = "docker-compose.clean.yml"
$DB_CONTAINER = "recipes-postgres"

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -Path $BACKUP_DIR -ItemType Directory | Out-Null
}

# Check if container is running
$containerId = docker-compose -f $DOCKER_COMPOSE_FILE ps -q $DB_CONTAINER
if (-not $containerId -or -not (docker ps -q | Select-String -Pattern $containerId -Quiet)) {
    Write-Host "Error: Database container is not running!" -ForegroundColor Red
    Write-Host "Please start the containers with: docker-compose -f $DOCKER_COMPOSE_FILE up -d" -ForegroundColor Yellow
    exit 1
}

# Create backup
Write-Host "Creating database backup..." -ForegroundColor Cyan
$backupCmd = "docker-compose -f $DOCKER_COMPOSE_FILE exec -T $DB_CONTAINER pg_dump -U postgres -d recipes > `"$BACKUP_FILE`""

# Execute the command using cmd.exe to ensure proper redirection
cmd.exe /c $backupCmd

# Check if backup was successful
if ($LASTEXITCODE -eq 0 -and (Test-Path $BACKUP_FILE) -and (Get-Item $BACKUP_FILE).Length -gt 0) {
    Write-Host "Backup created successfully: $BACKUP_FILE" -ForegroundColor Green
    
    # Compress the backup file using PowerShell
    try {
        Compress-Archive -Path $BACKUP_FILE -DestinationPath "$BACKUP_FILE.zip" -Force
        Remove-Item $BACKUP_FILE
        Write-Host "Backup compressed: $BACKUP_FILE.zip" -ForegroundColor Green
    } catch {
        Write-Host "Warning: Could not compress backup file, but uncompressed backup is available." -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: Backup failed!" -ForegroundColor Red
    if (Test-Path $BACKUP_FILE) {
        Remove-Item $BACKUP_FILE -Force
    }
    exit 1
}
